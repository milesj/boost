import { Contract, predicates, PortablePath } from '@boost/common';
import Cache from './Cache';
import ConfigFinder from './ConfigFinder';
import IgnoreFinder from './IgnoreFinder';
import Processor from './Processor';
import { ProcessedConfig, ConfigFile, Handler, IgnoreFile } from './types';

export default abstract class Configuration<T extends object> extends Contract<T> {
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
    return this.processConfigs(await this.getConfigFinder().loadFromBranchToRoot(dir));
  }

  /**
   * Load config files from the defined root. Root is determined by a relative
   * `.config` folder and `package.json` file.
   */
  async loadConfigFromRoot(dir: PortablePath = process.cwd()): Promise<ProcessedConfig<T>> {
    return this.processConfigs(await this.getConfigFinder().loadFromRoot(dir));
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all ignore files
   * within each branch directory, and the root.
   */
  async loadIgnoreFromBranchToRoot(dir: PortablePath): Promise<IgnoreFile[]> {
    return this.getIgnoreFinder().loadFromBranchToRoot(dir);
  }

  /**
   * Load ignore file from the defined root. Root is determined by a relative
   * `.config` folder and `package.json` file.
   */
  async loadIgnoreFromRoot(dir: PortablePath = process.cwd()): Promise<IgnoreFile[]> {
    return this.getIgnoreFinder().loadFromRoot(dir);
  }

  /**
   * Add a process handler to customize the processing of key-value pairs by name.
   */
  protected addProcessor<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
    this.processor.addHandler(key, handler);

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
   * Process all loaded config objects into a single config object, and then validate.
   */
  protected async processConfigs(files: ConfigFile<T>[]): Promise<ProcessedConfig<T>> {
    const config = await this.processor.process(this.options, files, this.blueprint(predicates));

    return {
      config,
      files,
    };
  }
}
