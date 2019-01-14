/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class ExitError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);

    this.code = code;
    this.name = 'ExitError';
  }
}
