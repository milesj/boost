/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

// TODO
export default class Module<To> {
  moduleName: string = '';

  name: string = '';

  options: To;

  constructor(options: To) {
    this.options = {
      // @ts-ignore
      ...options,
    };
  }
}
