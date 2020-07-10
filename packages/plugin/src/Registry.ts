import {
  Contract,
  Predicates,
  isObject,
  ModuleName,
  MODULE_NAME_PATTERN,
  Blueprint,
} from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { color } from '@boost/internal';
import pluralize from 'pluralize';
import kebabCase from 'lodash/kebabCase';
import upperFirst from 'lodash/upperFirst';
import Loader from './Loader';
import PluginError from './PluginError';
import debug from './debug';
import { DEFAULT_PRIORITY } from './constants';
import {
  RegistryOptions,
  Pluggable,
  Registration,
  Setting,
  RegisterOptions,
  Callback,
} from './types';

export default class Registry<Plugin extends Pluggable, Tool = unknown> extends Contract<
  RegistryOptions<Plugin>
> {
  readonly debug: Debugger;

  // Emits after a plugin is registered
  readonly onAfterRegister = new Event<[Plugin]>('after-register');

  // Emits after a plugin is unregistered
  readonly onAfterUnregister = new Event<[Plugin]>('after-unregister');

  // Emits before a plugin is registered
  readonly onBeforeRegister = new Event<[Plugin]>('before-register');

  // Emits before a plugin is unregistered
  readonly onBeforeUnregister = new Event<[Plugin]>('before-unregister');

  // Emits after a plugin is loaded but before its registered
  readonly onLoad = new Event<[string, object]>('load');

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

  blueprint({ func }: Predicates): Blueprint<RegistryOptions<Plugin>> {
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
  get<T extends Plugin = Plugin>(name: ModuleName): T {
    const container = this.plugins.find((c) => this.isMatchingName(c, name));

    if (container) {
      return container.plugin as T;
    }

    throw new PluginError('PLUGIN_REQUIRED', [this.singularName, name]);
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
   * Load and register a single plugin by name, or with an explicit instance.
   */
  async load(
    name: ModuleName | Plugin,
    params: object = {},
    options: RegisterOptions<Tool> = {},
  ): Promise<Plugin> {
    let plugin: Plugin;

    // Plugin instance
    if (isObject(name)) {
      plugin = name;

      if (plugin.priority) {
        // eslint-disable-next-line no-param-reassign
        options.priority = plugin.priority;
      }

      // Options object
    } else if (typeof name === 'string') {
      plugin = await this.loader.load(name, params);

      this.onLoad.emit([name, params]);

      // Unknown setting
    } else {
      throw new PluginError('SETTING_UNKNOWN', [name]);
    }

    if (!plugin.name) {
      throw new PluginError('PLUGIN_REQUIRED_NAME');
    }

    return this.register(plugin.name, plugin, options.tool, options);
  }

  /**
   * Load and register multiple plugins based on a list of settings.
   */
  async loadMany(
    settings: (ModuleName | Plugin)[] | Setting,
    options: RegisterOptions<Tool> = {},
  ): Promise<Plugin[]> {
    if (Array.isArray(settings)) {
      return Promise.all(settings.map((setting) => this.load(setting, {}, options)));
    }

    return Promise.all(
      Object.entries(settings)
        .filter(([name, setting]) => setting !== false && setting !== undefined)
        .map(([name, setting]) => this.load(name, isObject(setting) ? setting : {}, options)),
    );
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
    tool: Tool | undefined = undefined,
    { priority }: RegisterOptions<Tool> = {},
  ): Promise<Plugin> {
    if (!name.match(MODULE_NAME_PATTERN)) {
      throw new PluginError('MODULE_NAME_INVALID', [this.pluralName]);
    }

    if (!isObject(plugin)) {
      throw new PluginError('REGISTER_REQUIRED', [upperFirst(this.pluralName), typeof plugin]);
    }

    this.debug('Validating plugin "%s"', name);

    await this.options.validate(plugin);

    this.debug('Registering plugin "%s" with defined tool and triggering startup', name);

    this.onBeforeRegister.emit([plugin]);

    await this.triggerStartup(plugin, tool);

    this.plugins.push({
      name,
      plugin,
      priority: priority ?? DEFAULT_PRIORITY,
    });

    this.debug('Sorting plugins by priority');

    this.plugins.sort((a, b) => a.priority! - b.priority!);

    this.onAfterRegister.emit([plugin]);

    debug('Plugin "%s" registered', plugin.name || name);

    return plugin;
  }

  /**
   * Unregister a plugin by name and trigger shutdown process.
   */
  async unregister(name: ModuleName, tool?: Tool): Promise<Plugin> {
    const plugin = this.get(name);

    this.onBeforeUnregister.emit([plugin]);

    this.debug('Unregistering plugin "%s" with defined tool and triggering shutdown', name);

    await this.triggerShutdown(plugin, tool);

    this.plugins = this.plugins.filter((container) => !this.isMatchingName(container, name));

    this.onAfterUnregister.emit([plugin]);

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
