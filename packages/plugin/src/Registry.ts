import { Contract, Predicates, isObject, ModuleName, MODULE_NAME_PATTERN } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { color } from '@boost/internal';
import pluralize from 'pluralize';
import kebabCase from 'lodash/kebabCase';
import upperFirst from 'lodash/upperFirst';
import Loader from './Loader';
import PluginError from './PluginError';
import debug from './debug';
import {
  RegistryOptions,
  Pluggable,
  Registration,
  Setting,
  PluginOptions,
  Callback,
} from './types';
import { DEFAULT_PRIORITY } from './constants';

export default class Registry<Plugin extends Pluggable, Tool = unknown> extends Contract<
  RegistryOptions<Plugin>
> {
  readonly debug: Debugger;

  // Emits after a plugin is loaded but before its registered
  readonly onLoad = new Event<[Setting<Plugin>, object?]>('load');

  // Emits after a plugin is registered
  readonly onRegister = new Event<[Plugin]>('register');

  // Emits before a plugin is unregistered
  readonly onUnregister = new Event<[Plugin]>('unregister');

  readonly pluralName: string;

  readonly projectName: string;

  readonly singularName: string;

  private loader: Loader<Plugin>;

  private plugins: Registration<Plugin>[] = [];

  constructor(projectName: string, typeName: string, options: RegistryOptions<Plugin>) {
    super(options);

    this.projectName = kebabCase(projectName);
    this.singularName = kebabCase(typeName);
    this.pluralName = pluralize(this.singularName);
    this.debug = createDebugger([this.singularName, 'registry']);
    this.loader = new Loader(this);

    this.debug('Creating new plugin type: %s', color.symbol(this.singularName));

    debug('New plugin type created: %s', this.singularName);
  }

  blueprint({ func }: Predicates) {
    return {
      afterShutdown: func<Callback>(),
      afterStartup: func<Callback>(),
      beforeShutdown: func<Callback>(),
      beforeStartup: func<Callback>(),
      validate: func<Callback>().notNullable().required(),
    };
  }

  /**
   * Format a name into a fully qualified and compatible Node/NPM module name,
   * with the tool and type names being used as scopes and prefixes.
   */
  formatModuleName(name: string, scoped: boolean = false): ModuleName {
    if (scoped) {
      return `@${this.projectName}/${this.singularName}-${name.toLocaleLowerCase()}`;
    }

    return `${this.projectName}-${this.singularName}-${name.toLocaleLowerCase()}`;
  }

  /**
   * Return a single registered plugin by module name. If the plugin cannot be found,
   * an error will be thrown.
   */
  get(name: ModuleName): Plugin {
    const container = this.plugins.find((c) => this.isMatchingName(c, name));

    if (container) {
      return container.plugin;
    }

    throw new PluginError('MISSING_PLUGIN', [this.singularName, name]);
  }

  /**
   * Return all registered plugins.
   */
  getAll(): Plugin[] {
    return this.plugins.map((container) => container.plugin);
  }

  /**
   * Return multiple registered plugins by module name.
   */
  getMany(names: ModuleName[]): Plugin[] {
    return names.map((name) => this.get(name));
  }

  /**
   * Load and register a single plugin based on a setting. The possible setting variants are:
   *
   * - If a string, will load based on module name or file path.
   * - If an array, the 1st item will be considered the module name or file path,
   *    and the 2nd item an options object that will be passed to the factory function.
   *    A 3rd object can be provided to customize priority.
   * - If an object or class instance, will assume to be the plugin itself.
   */
  async load(setting: Setting<Plugin>, options?: object, tool?: Tool): Promise<Plugin> {
    const opts: PluginOptions = {};
    let plugin: Plugin;

    // Module name
    if (typeof setting === 'string') {
      plugin = await this.loader.load(setting, options);

      // Module name with options
    } else if (Array.isArray(setting)) {
      plugin = await this.loader.load(setting[0], setting[1] || options);

      if (isObject(setting[2])) {
        Object.assign(opts, setting[2]);
      }

      // Plugin directly
    } else if (isObject<Plugin>(setting)) {
      if (setting.name) {
        plugin = setting;

        if (setting.priority) {
          opts.priority = setting.priority;
        }
      } else {
        throw new PluginError('MISSING_PLUGIN_NAME');
      }

      // Unknown setting
    } else {
      throw new PluginError('UNKNOWN_SETTING', [setting]);
    }

    this.onLoad.emit([setting, options]);

    return this.register(plugin.name, plugin, tool, opts);
  }

  /**
   * Load and register multiple plugins based on a list of settings.
   */
  async loadMany(settings: Setting<Plugin>[], tool?: Tool): Promise<Plugin[]> {
    return Promise.all(settings.map((setting) => this.load(setting, {}, tool)));
  }

  /**
   * Return true if a plugin has been registered.
   */
  isRegistered(name: ModuleName): boolean {
    try {
      this.get(name);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Register a plugin and trigger startup with the provided tool.
   */
  async register(
    name: ModuleName,
    plugin: Plugin,
    tool?: Tool,
    options?: PluginOptions,
  ): Promise<Plugin> {
    if (!name.match(MODULE_NAME_PATTERN)) {
      throw new PluginError('INVALID_MODULE_NAME', [this.pluralName]);
    }

    if (!isObject(plugin)) {
      throw new PluginError('INVALID_REGISTER', [upperFirst(this.pluralName), typeof plugin]);
    }

    this.debug('Validating plugin "%s"', name);

    await this.options.validate(plugin);

    this.debug('Registering plugin "%s" with defined tool and triggering startup', name);

    await this.triggerStartup(plugin, tool);

    this.plugins.push({
      priority: DEFAULT_PRIORITY,
      ...options,
      name,
      plugin,
    });

    this.debug('Sorting plugins by priority');

    this.plugins.sort((a, b) => a.priority! - b.priority!);

    this.onRegister.emit([plugin]);

    debug('Plugin "%s" registered', plugin.name || name);

    return plugin;
  }

  /**
   * Unregister a plugin by name and trigger shutdown process.
   */
  async unregister(name: ModuleName, tool?: Tool): Promise<Plugin> {
    const plugin = this.get(name);

    this.onUnregister.emit([plugin]);

    this.debug('Unregistering plugin "%s" with defined tool and triggering shutdown', name);

    await this.triggerShutdown(plugin, tool);

    this.plugins = this.plugins.filter((container) => !this.isMatchingName(container, name));

    debug('Plugin "%s" unregistered', plugin.name || name);

    return plugin;
  }

  /**
   * Verify a passed name matches one of many possible module name variants for this plugin.
   */
  protected isMatchingName(container: Registration<Plugin>, name: string): boolean {
    if (container.name === name) {
      return true;
    }

    const internalModule = this.formatModuleName(name, true);
    const publicModule = this.formatModuleName(name);

    return container.name === internalModule || container.name === publicModule;
  }

  /**
   * Trigger shutdown events for the registry and plugin.
   */
  protected async triggerShutdown(plugin: Plugin, tool?: Tool) {
    const { afterShutdown, beforeShutdown } = this.options;

    if (beforeShutdown) {
      await beforeShutdown(plugin);
    }

    if (typeof plugin.shutdown === 'function') {
      await plugin.shutdown(tool);
    }

    if (afterShutdown) {
      await afterShutdown(plugin);
    }
  }

  /**
   * Trigger startup events for the registry and plugin.
   */
  protected async triggerStartup(plugin: Plugin, tool?: Tool) {
    const { afterStartup, beforeStartup } = this.options;

    if (beforeStartup) {
      await beforeStartup(plugin);
    }

    if (typeof plugin.startup === 'function') {
      await plugin.startup(tool);
    }

    if (afterStartup) {
      await afterStartup(plugin);
    }
  }
}
