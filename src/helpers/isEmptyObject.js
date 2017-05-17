/**
 * @copyright   2016-2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './isObject';

/**
 * Return true if the object is empty (has no keys).
 */
export default function isEmptyObject(value: *): boolean {
  return (isObject(value) && Object.keys(value).length === 0);
}
