import { Contract } from '@boost/common';
import Cache from './Cache';
import ConfigFinder from './ConfigFinder';
import IgnoreFinder from './IgnoreFinder';
import Processor from './Processor';
import { ProcessedConfig, ConfigFile, Handler } from './types';

export default abstract class Configuration<T extends object> extends Contract<T> {
  private cache: Cache;

  private configFinder: ConfigFinder<T>;

  private ignoreFinder: IgnoreFinder;

  private name: string;

  private processor: Processor<T>;

  constructor(name: string) {
    super();

    this.name = name;
    this.cache = new Cache();
    this.configFinder = new ConfigFinder({ name }, this.cache);
    this.ignoreFinder = new IgnoreFinder({ name }, this.cache);
    this.processor = new Processor();
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
   * Return the config file finder instance.
   */
  getConfigFinder(): ConfigFinder<T> {
    return this.configFinder;
  }

  /**
   * Return the ignore file finder instance.
   */
  getIgnoreFinder(): IgnoreFinder {
    return this.ignoreFinder;
  }

  /**
   * Add a handler to customize the processing of key-value pairs while combining
   * multiple config objects into a single object.
   */
  protected addHandler<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
    this.processor.addHandler(key, handler);

    return this;
  }

  /**
   * Process all loaded configs into a single config result.
   */
  private processConfigs(files: ConfigFile<T>[]): ProcessedConfig<T> {
    const config = this.configure(baseConfig =>
      this.processor.process(
        baseConfig,
        files.map(file => file.config),
      ),
    );

    return {
      config,
      files,
    };
  }
}
