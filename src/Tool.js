/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import ConfigLoader from './ConfigLoader';
import isEmptyObject from './helpers/isEmptyObject';

import type { ToolConfig, PackageConfig } from './types';

export default class Tool {
  config: ToolConfig;
  name: string;
  package: PackageConfig;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Load the package.json and local configuration files.
   *
   * Must be called first in the lifecycle.
   */
  loadConfig() {
    const configLoader = new ConfigLoader(this.name);

    this.package = configLoader.loadPackageJSON();
    this.config = configLoader.loadConfig();
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadPlugins() {
    if (isEmptyObject(this.config)) {
      throw new Error('Cannot load plugins as configuration has not been loaded.');
    }

    // TODO
  }
}
