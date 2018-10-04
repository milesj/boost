/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/**
 * Handle special cases when merging 2 configuration values.
 * If the target and source are both arrays, concatenate them.
 */
export default function handleMerge(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) {
    return Array.from(new Set([...target, ...source]));
  }

  // Defer to lodash
  return undefined;
}
