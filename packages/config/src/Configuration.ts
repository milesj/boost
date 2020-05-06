import { Contract, PortablePath } from '@boost/common';
import Cache from './Cache';
import Finder from './Finder';
import { ProcessedConfig } from './types';

export default abstract class Configuration<T extends object> extends Contract<T> {
  protected cache: Cache<T>;

  protected finder: Finder<T>;

  protected name: string;

  constructor(name: string) {
    super();

    this.name = name;
    this.cache = new Cache();
    this.finder = new Finder({ name }, this.cache);
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
    const files = await this.finder.loadFromBranchToRoot(dir);

    return {
      config: this.options,
      files,
    };
  }

  /**
   * Load root config files from a relative `.config` folder, and a config block from a
   * relative `package.json`. Package configurations take lowest precedence.
   *
   * Once loaded, process all configs into a final config result.
   */
  async loadFromRoot(dir: PortablePath = process.cwd()): Promise<ProcessedConfig<T>> {
    const files = await this.finder.loadFromRoot(dir);

    return {
      config: this.options,
      files,
    };
  }
}
