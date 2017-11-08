/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Import a module and handle default exports correctly.
 */
export default function requireModule(path: string): * {
  let value = require(path); // eslint-disable-line

  // Support Babel compiled files
  // eslint-disable-next-line no-underscore-dangle
  if (value.__esModule) {
    value = value.default;
  }

  return value;
}
