/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class Module<To> {
  moduleName: string = '';

  name: string = '';

  options: To;

  constructor(options: Partial<To> = {}) {
    // @ts-ignore
    this.options = { ...options };
  }
}
