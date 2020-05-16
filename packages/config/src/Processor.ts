/* eslint-disable no-await-in-loop, no-restricted-syntax */

import { isObject, Blueprint, optimal, Contract, Predicates } from '@boost/common';
import mergeArray from './helpers/mergeArray';
import mergeObject from './helpers/mergeObject';
import { Handler, ConfigFile, ProcessorOptions } from './types';

export default class Processor<T extends object> extends Contract<ProcessorOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected handlers: { [K in keyof T]?: Handler<any> } = {};

  blueprint({ bool, string }: Predicates) {
    return {
      defaultWhenUndefined: bool(true),
      name: string()
        .required()
        .camelCase(),
      validate: bool(true),
    };
  }

  /**
   * Add a handler to process a key-value setting pair.
   */
  addHandler<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
    this.handlers[key] = handler;

    return this;
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
    const { defaultWhenUndefined: defaultWithUndefined, validate } = this.options;
    const config = { ...defaults };

    for (const next of configs) {
      // Validate next config object
      if (validate) {
        optimal(config, blueprint, {
          file: next.path.path(),
          name: this.options.name,
        });
      }

      // Merge properties into previous object
      for (const [key, value] of Object.entries(next.config)) {
        const name = key as keyof T;
        const nextValue = value as T[keyof T];
        const prevValue = config[name];
        const handler = this.handlers[name];

        if (handler) {
          config[name] = await handler(prevValue, nextValue);
        } else if (isObject(prevValue) && isObject(nextValue)) {
          config[name] = mergeObject(prevValue, nextValue);
        } else if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
          config[name] = mergeArray(prevValue, nextValue);
        } else {
          config[name] = nextValue;
        }

        // Reset to default value if undefined is present
        if (config[name] === undefined && defaultWithUndefined) {
          config[name] = defaults[name];
        }
      }
    }

    return config;
  }
}
