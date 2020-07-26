import { Contract, predicates, PortablePath, Blueprint } from '@boost/common';
import { Event, WaterfallEvent } from '@boost/event';
import Cache from './Cache';
import ConfigFinder from './ConfigFinder';
import IgnoreFinder from './IgnoreFinder';
import Processor from './Processor';
import {
  ProcessedConfig,
  ConfigFile,
  Handler,
  IgnoreFile,
  ConfigFinderOptions,
  ProcessorOptions,
} from './types';

export default abstract class Configuration<T extends object> extends Contract<T> {
  readonly onLoadedConfig = new WaterfallEvent<ConfigFile<T>[]>('loaded-config');

  readonly onLoadedIgnore = new WaterfallEvent<IgnoreFile[]>('loaded-ignore');

  readonly onProcessedConfig = new Event<[Required<T>]>('processed-config');

  private cache: Cache;

  private configFinder: ConfigFinder<T>;

  private ignoreFinder: IgnoreFinder;

  private processor: Processor<T>;

  constructor(name: string) {
    super();

    this.cache = new Cache();
    this.configFinder = new ConfigFinder({ name }, this.cache);
    this.ignoreFinder = new IgnoreFinder({ name }, this.cache);
    this.processor = new Processor({ name });
    this.bootstrap();
  }

  /**
   * Clear all cache.
   */
  clearCache(): this {
    this.clearFileCache();
    this.clearFinderCache();

    return this;
  }

  /**
   * Clear all cached file contents.
   */
  clearFileCache(): this {
    this.cache.clearFileCache();

    return this;
  }

  /**
   * Clear all cached directory and file path information.
   */
  clearFinderCache(): this {
    this.cache.clearFinderCache();

    return this;
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all config files
   * within each branch directory, and the root.
   */
  async loadConfigFromBranchToRoot(dir: PortablePath): Promise<ProcessedConfig<T>> {
    const configs = await this.getConfigFinder().loadFromBranchToRoot(dir);

    return this.processConfigs(this.onLoadedConfig.emit(configs));
  }

  /**
   * Load config files from the defined root. Root is determined by a relative
   * `.config` folder and `package.json` file.
   */
  async loadConfigFromRoot(dir: PortablePath = process.cwd()): Promise<ProcessedConfig<T>> {
    const configs = await this.getConfigFinder().loadFromRoot(dir);

    return this.processConfigs(this.onLoadedConfig.emit(configs));
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all ignore files
   * within each branch directory, and the root.
   */
  async loadIgnoreFromBranchToRoot(dir: PortablePath): Promise<IgnoreFile[]> {
    const ignores = await this.getIgnoreFinder().loadFromBranchToRoot(dir);

    return this.onLoadedIgnore.emit(ignores);
  }

  /**
   * Load ignore file from the defined root. Root is determined by a relative
   * `.config` folder and `package.json` file.
   */
  async loadIgnoreFromRoot(dir: PortablePath = process.cwd()): Promise<IgnoreFile[]> {
    const ignores = await this.getIgnoreFinder().loadFromRoot(dir);

    return this.onLoadedIgnore.emit(ignores);
  }

  /**
   * Add a process handler to customize the processing of key-value setting pairs.
   * May only run a processor on settings found in the root of the configuration object.
   */
  protected addProcessHandler<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
    this.getProcessor().addHandler(key, handler);

    return this;
  }

  /**
   * Called on initialization.
   */
  protected bootstrap() {}

  /**
   * Configure the finder instance.
   */
  protected configureFinder(options: Omit<ConfigFinderOptions<T>, 'name'>): this {
    this.getConfigFinder().configure(options);

    return this;
  }

  /**
   * Configure the processor instance.
   */
  protected configureProcessor(options: Omit<ProcessorOptions, 'name'>): this {
    this.getProcessor().configure(options);

    return this;
  }

  /**
   * Return the config file finder instance.
   */
  protected getConfigFinder(): ConfigFinder<T> {
    return this.configFinder;
  }

  /**
   * Return the ignore file finder instance.
   */
  protected getIgnoreFinder(): IgnoreFinder {
    return this.ignoreFinder;
  }

  /**
   * Return the processor instance.
   */
  protected getProcessor(): Processor<T> {
    return this.processor;
  }

  /**
   * Process all loaded config objects into a single config object, and then validate.
   */
  protected async processConfigs(files: ConfigFile<T>[]): Promise<ProcessedConfig<T>> {
    const config = await this.getProcessor().process(
      this.options,
      files,
      this.blueprint(predicates) as Blueprint<T>,
    );

    this.onProcessedConfig.emit([config]);

    return {
      config,
      files,
    };
  }
}
