import { Contract, Predicates, isObject } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { RuntimeError } from '@boost/internal';
import pluralize from 'pluralize';
import kebabCase from 'lodash/kebabCase';
import Loader from './Loader';
import { ManagerOptions, Pluggable, LoadResult } from './types';

export default class Manager<Plugin extends Pluggable, Tool = unknown> extends Contract<
  ManagerOptions<Plugin>
> {
  readonly debug: Debugger;

  readonly pluralName: string;

  readonly singularName: string;

  readonly toolName: string;

  private loader: Loader<Plugin>;

  private plugins: LoadResult<Plugin>[] = [];

  constructor(toolName: string, typeName: string, options: ManagerOptions<Plugin>) {
    super(options);

    this.toolName = toolName;
    this.singularName = kebabCase(typeName);
    this.pluralName = pluralize(this.singularName);
    this.debug = createDebugger([this.singularName, 'manager']);
    this.loader = new Loader(this);
  }

  blueprint({ func }: Predicates) {
    return {
      afterShutdown: func().nullable(),
      afterStartup: func().nullable(),
      beforeShutdown: func().nullable(),
      beforeStartup: func().nullable(),
      validate: func(),
      // eslint-disable-next-line
    } as any;
  }

  /**
   * Manually add a plugin and trigger startup with the provided tool.
   */
  addPlugin(result: LoadResult<Plugin>, tool: Tool): this {
    const { name, plugin } = result;

    if (!name) {
      throw new Error(`A fully qualified module name is required for ${this.pluralName}.`);
    }

    if (!isObject(plugin)) {
      throw new TypeError(
        `Expected an object or class instance for the ${
          this.singularName
        }, found ${typeof plugin}.`,
      );
    }

    this.debug('Validating plugin "%s"', name);

    this.options.validate(plugin);

    this.debug('Adding plugin "%s" with defined tool and triggering startup', name);

    this.triggerStartup(plugin, tool);

    this.plugins.push(result);

    return this;
  }

  /**
   * Format a name into a fully qualified and compatible NPM module name,
   * with the tool and type names being used as scopes and prefixes.
   */
  formatModuleName(name: string, scoped: boolean = false): string {
    if (scoped) {
      return `@${this.toolName}/${this.singularName}-${name}`;
    }

    return `${this.toolName}-${this.singularName}-${name}`;
  }

  /**
   * Return a single plugin by module name.
   */
  getPlugin(name: string): Plugin {
    const plugin = this.plugins.find(result => this.isMatchingName(result, name));

    if (plugin) {
      return plugin.plugin;
    }

    throw new RuntimeError('plugin', 'PG_MISSING_PLUGIN', [this.singularName, name]);
  }

  /**
   * Return all plugins sorted by priority.
   */
  getPlugins(): Plugin[] {
    const plugins = [...this.plugins];

    plugins.sort((a, b) => a.priority - b.priority);

    return plugins.map(result => result.plugin);
  }

  /**
   * Return true if a plugin has been loaded and added.
   */
  isPluginLoaded(name: string): boolean {
    return !!this.getPlugin(name);
  }

  /**
   * Remove a plugin by name and trigger shutdown process.
   */
  removePlugin(name: string): this {
    const plugin = this.getPlugin(name);

    this.debug('Removing plugin "%s" and triggering shutdown', name);

    this.triggerShutdown(plugin);

    this.plugins = this.plugins.filter(result => !this.isMatchingName(result, name));

    return this;
  }

  /**
   * Verify a passed name matches one of many possible module name variants for this plugin.
   */
  protected isMatchingName(result: LoadResult<Plugin>, name: string): boolean {
    const internalModule = this.formatModuleName(name, true);
    const publicModule = this.formatModuleName(name);

    return result.name === name || result.name === publicModule || result.name === internalModule;
  }

  /**
   * Trigger shutdown events for the manager and plugin.
   */
  protected triggerShutdown(plugin: Plugin) {
    const { afterShutdown, beforeShutdown } = this.options;

    if (beforeShutdown) {
      beforeShutdown(plugin);
    }

    if (typeof plugin.shutdown === 'function') {
      plugin.shutdown();
    }

    if (afterShutdown) {
      afterShutdown(plugin);
    }
  }

  /**
   * Trigger startup events for the manager and plugin.
   */
  protected triggerStartup(plugin: Plugin, tool: Tool) {
    const { afterStartup, beforeStartup } = this.options;

    if (beforeStartup) {
      beforeStartup(plugin);
    }

    if (typeof plugin.startup === 'function') {
      plugin.startup(tool);
    }

    if (afterStartup) {
      afterStartup(plugin);
    }
  }
}
