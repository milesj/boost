import { Contract, PortablePath } from '@boost/common';
import Cache from './Cache';
import Finder from './Finder';
import Processor from './Processor';
import { FinderOptions, ProcessedConfig, LoadedConfig, Handler, ProcessorOptions } from './types';

export default abstract class Configuration<T extends object> extends Contract<T> {
  private cache: Cache<T>;

  private finder: Finder<T>;

  private name: string;

  private processor: Processor<T>;

  constructor(name: string) {
    super();

    this.name = name;
    this.cache = new Cache();
    this.finder = new Finder({ name }, this.cache);
    this.processor = new Processor();
  }

  /**
   * Clear all cache.
   */
  clearCache(): this {
    this.clearConfigCache();
    this.clearFinderCache();

    return this;
  }

  /**
   * Clear all cached configuration file contents.
   */
  clearConfigCache(): this {
    this.cache.clearConfigCache();

    return this;
  }

  /**
   * Clear all cached directory and file information.
   */
  clearFinderCache(): this {
    this.cache.clearFinderCache();

    return this;
  }

  /**
   * Traverse upwards from the branch directory, until the root directory is found,
   * or we reach to top of the file system. While traversing, find all config files
   * within each branch directory, and load them.
   *
   * Once loaded, process all configs into a final config result.
   */
  async loadFromBranchToRoot(dir: PortablePath): Promise<ProcessedConfig<T>> {
    return this.processConfigs(await this.finder.loadFromBranchToRoot(dir));
  }

  /**
   * Load root config files from a relative `.config` folder, and a config block from a
   * relative `package.json`. Package configurations take lowest precedence.
   *
   * Once loaded, process all configs into a final config result.
   */
  async loadFromRoot(dir: PortablePath = process.cwd()): Promise<ProcessedConfig<T>> {
    return this.processConfigs(await this.finder.loadFromRoot(dir));
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
   * Configure finder specific options.
   */
  protected configureFinder(options: Omit<FinderOptions<T>, 'name'>): this {
    this.finder.configure({
      ...options,
      name: this.name,
    });

    return this;
  }

  /**
   * Configure processor specific options.
   */
  protected configureProcessor(options: ProcessorOptions): this {
    this.processor.configure(options);

    return this;
  }

  /**
   * Process all loaded configs into a single config result.
   */
  private processConfigs(files: LoadedConfig<T>[]): ProcessedConfig<T> {
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
