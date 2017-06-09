/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Config } from './types';

export default class Plugin {
  config: Config;

  constructor(config: Config = {}) {
    this.config = config;
  }
}
