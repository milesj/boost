/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Return true if the value is a literal object.
 */
export default function isObject(value: mixed): boolean {
  return (typeof value === 'object' && value !== null && !Array.isArray(value));
}
