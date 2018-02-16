/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default class Module<To> {
  moduleName: string = '';

  name: string = '';

  options: To;

  constructor(options?: To) {
    this.options = { ...options };
  }
}
