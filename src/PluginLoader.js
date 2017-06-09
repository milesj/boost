/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Plugin from './Plugin';

type PluginOrName = string | Plugin;

export default class PluginLoader {
  appName: string;
  plugins: Plugin[] = [];

  constructor(appName: string) {
    this.appName = appName;
  }

  importPlugin(name: string): Plugin {
    return new Plugin(); // TODO
  }

  loadPlugins(plugins: PluginOrName[]): Plugin[] {
    plugins.forEach((plugin) => {
      if (plugin instanceof Plugin) {
        this.plugins.push(plugin);

      } else if (typeof plugin === 'string') {
        this.plugins.push(this.importPlugin(plugin));

      } else {
        throw new Error(
          'Invalid plugin. Must be an instance of `Plugin` ' +
          'or the name of a module that exports a `Plugin`.',
        );
      }
    });

    return this.plugins;
  }
}
