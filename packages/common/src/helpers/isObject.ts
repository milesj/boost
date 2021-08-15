/**
 * Returns `true` if the value is an object.
 *
 * ```ts
 * import { isObject } from '@boost/common';
 *
 * isObject({}); // true
 * isObject(new Foo()); // true
 * isObject([]); // false
 * ```
 *
 * Generics can be used to type the return value of the object (when necessary).
 *
 * ```ts
 * interface Person {
 * 	name: string;
 * }
 *
 * if (isObject<Person>(person)) {
 * 	console.log(person.name);
 * }
 * ```
 */
export function isObject<T = object>(value: unknown): value is T {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
