/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default class ExitError extends Error {
  code: number;

  constructor(message: string, code?: number = 1) {
    super(message);

    this.code = code;
    this.name = 'ExitError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExitError);
    }
  }
}
