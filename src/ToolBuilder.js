/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import ConfigLoader from './ConfigLoader';
import PluginLoader from './PluginLoader';
import Renderer from './Renderer';
import Tool from './Tool';
import isEmptyObject from './helpers/isEmptyObject';

import type { CommandOptions } from './types';

export default class ToolBuilder {
  appName: string;

  pluginName: string;

  tool: Tool;

  constructor(appName: string, pluginName: string = 'plugin') {
    this.appName = appName;
    this.pluginName = pluginName;
    this.tool = new Tool(appName);
  }

  /**
   * Bootstrap plugins by registering event listeners and passing the tool object.
   */
  bootstrapPlugins(): this {
    return this; // TODO
  }

  /**
   * Return the configured Tool instance.
   */
  build(): Tool {
    return this.tool;
  }

  /**
   * Load the package.json and local configuration files.
   *
   * Must be called first in the lifecycle.
   */
  loadConfig(): this {
    const configLoader = new ConfigLoader(this.appName, this.pluginName);

    this.tool.package = configLoader.loadPackageJSON();
    this.tool.config = configLoader.loadConfig();

    return this;
  }

  /**
   * Register plugins from the loaded configuration.
   *
   * Must be called after config has been loaded.
   */
  loadPlugins(): this {
    if (isEmptyObject(this.tool.config)) {
      throw new Error('Cannot load plugins as configuration has not been loaded.');
    }

    const pluginLoader = new PluginLoader(this.appName, this.pluginName);

    this.tool.plugins = pluginLoader.loadPlugins(this.tool.config.plugins || []);

    return this;
  }

  /**
   * Set the currently active command options passed down by the CLI.
   */
  setCommand(command?: CommandOptions): this {
    if (this.tool.command) {
      throw new Error('Command options have already been defined, cannot redefine.');
    }

    this.tool.command = {
      options: {},
      ...command,
    };

    return this;
  }

  /**
   * Set the renderer that controls the CLI output.
   */
  setRenderer(renderer: Renderer): this {
    if (renderer instanceof Renderer) {
      this.tool.renderer = renderer;
    } else {
      throw new TypeError('Invalid rendered, must be an instance of `Renderer`.');
    }

    return this;
  }
}
