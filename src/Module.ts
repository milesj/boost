/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Options } from 'optimal';

export interface ModuleInterface {
  moduleName: string;
  name: string;
}

export default class Module<To extends Options> implements ModuleInterface {
  moduleName: string = '';

  name: string = '';

  options: To;

  constructor(options?: To) {
    this.options = {
      // @ts-ignore
      ...options,
    };
  }
}
