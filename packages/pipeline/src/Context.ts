/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { isObject, isPlainObject } from '@boost/common';

interface Cloneable {
	clone?: () => unknown;
}

export class Context {
	/**
	 * Create a new instance of the current context and shallow clone all properties.
	 */
	clone(...args: any[]): this {
		// @ts-expect-error Allow invalid args
		const context = new this.constructor(...args);

		// Copy enumerable properties
		Object.keys(this).forEach((key) => {
			const prop = key as keyof this;
			let value: unknown = this[prop];

			if (Array.isArray(value)) {
				value = [...value];
			} else if (value instanceof Map) {
				value = new Map(value);
			} else if (value instanceof Set) {
				value = new Set(value);
			} else if (value instanceof Date) {
				value = new Date(value.getTime());
			} else if (isObject<Cloneable>(value)) {
				if (typeof value.clone === 'function') {
					value = value.clone();
					// Dont dereference instances, only plain objects
				} else if (isPlainObject(value)) {
					value = { ...value };
				}
			}

			context[prop] = value;
		});

		return context;
	}
}
