/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/**
 * Return true if the value is a literal object.
 */
export default function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
