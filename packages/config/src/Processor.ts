/* eslint-disable no-await-in-loop */

import { Contract, isObject } from '@boost/common';
import { Blueprint, optimal, Schemas } from '@boost/common/optimal';
import { createDebugger, Debugger } from '@boost/debug';
import { color } from '@boost/internal';
import { mergeArray } from './helpers/mergeArray';
import { mergeObject } from './helpers/mergeObject';
import { ConfigFile, Handler, ProcessorOptions } from './types';

export class Processor<T extends object> extends Contract<ProcessorOptions> {
	protected readonly debug: Debugger;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected handlers: { [K in keyof T]?: Handler<any> } = {};

	constructor(options: ProcessorOptions) {
		super(options);

		this.debug = createDebugger(['processor', this.options.name]);
	}

	blueprint(schemas: Schemas): Blueprint<ProcessorOptions> {
		const { bool, string } = schemas;

		return {
			defaultWhenUndefined: bool(true),
			name: string().required().camelCase(),
			validate: bool(true),
		};
	}

	/**
	 * Add a handler to process a key-value setting pair.
	 */
	addHandler<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
		this.debug('Adding process handler for %s', color.symbol(key));

		this.handlers[key] = handler;

		return this;
	}

	/**
	 * Return a handler, or null, for the setting key.
	 */
	getHandler<K extends keyof T, V = T[K]>(key: K): Handler<V> | null {
		return (this.handlers[key] as Handler<V>) || null;
	}

	/**
	 * Process a list of loaded config files into a single config object.
	 * Use the defined process handlers, or the default processing rules,
	 * to generate the final config object.
	 */
	async process(
		defaults: Required<T>,
		configs: ConfigFile<T>[],
		blueprint: Blueprint<T>,
	): Promise<Required<T>> {
		const { defaultWhenUndefined, validate } = this.options;
		const config = { ...defaults };

		this.debug('Processing %d configs into a single and final result', configs.length);

		for (const next of configs) {
			// Validate next config object
			if (validate) {
				optimal(blueprint, {
					file: next.path.path(),
				}).validate(next.config);
			}

			// Merge properties into previous object
			for (const [key, value] of Object.entries(next.config)) {
				const name = key as keyof T;
				const nextValue = value as T[keyof T];
				const prevValue = config[name];
				const handler = this.getHandler(name);

				if (handler) {
					config[name] = (await handler(prevValue, nextValue))!;
				} else if (isObject(prevValue) && isObject(nextValue)) {
					config[name] = mergeObject(prevValue, nextValue);
				} else if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
					config[name] = mergeArray(prevValue, nextValue);
				} else {
					config[name] = nextValue;
				}

				// Reset to default value if undefined is present
				if (config[name] === undefined && defaultWhenUndefined) {
					config[name] = defaults[name];
				}
			}
		}

		return config;
	}
}
