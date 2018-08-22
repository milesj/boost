/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class Module<Options> {
  moduleName: string = '';

  name: string = '';

  options: Options;

  constructor(options: Partial<Options> = {}) {
    // @ts-ignore
    this.options = { ...options };
  }
}
