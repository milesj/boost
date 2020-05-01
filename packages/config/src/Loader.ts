import { Contract, Predicates, PortablePath, Path, parseFile } from '@boost/common';
import { LoaderOptions } from './types';
import { CONFIG_FOLDER } from './constants';

interface LoadedFile<T> {
  path: Path;
  data: Partial<T>;
}

export default class Loader<T extends object> extends Contract<LoaderOptions> {
  // From highest -> lowest priority
  protected loadedFiles: LoadedFile<T>[] = [];

  protected root?: Path;

  blueprint({ array, bool, string }: Predicates) {
    return {
      env: bool(true),
      exts: array(string(), ['js', 'json5', 'json', 'yaml', 'yml']),
      name: string()
        .required()
        .camelCase(),
    };
  }

  getConfigFileName(ext: string, branch: boolean = false, env: boolean = false) {
    let { name } = this.options;

    if (branch) {
      name = `.${name}`;
    }

    if (env && this.options.env) {
      name += `.${(process.env.NODE_ENV || 'development').toLowerCase()}`;
    }

    name += `.${ext}`;

    return name;
  }

  loadUpwardsFromBranch(dir: PortablePath) {
    let currentDir = Path.resolve(dir);

    if (!currentDir.isDirectory()) {
      throw new Error('Starting path must be a directory.');
    }

    while (currentDir.path() !== '' && currentDir.path() !== '/') {
      if (this.isConfigRootDir(currentDir)) {
        this.loadConfigFilesInDir(currentDir.append(CONFIG_FOLDER), true);

        break;
      }

      this.loadConfigFilesInDir(currentDir, true);
      currentDir = currentDir.parent();
    }
  }

  protected loadConfigFilesInDir(dir: Path, branch: boolean = false) {
    let found = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const ext of this.options.exts) {
      const configEnvPath = dir.append(this.getConfigFileName(ext, branch, true));

      if (configEnvPath.exists()) {
        this.loadedFiles.push({
          data: parseFile(configEnvPath),
          path: configEnvPath,
        });

        found = true;
      }

      const configPath = dir.append(this.getConfigFileName(ext, branch));

      if (configPath.exists()) {
        this.loadedFiles.push({
          data: parseFile(configPath),
          path: configPath,
        });

        found = true;
      }

      if (found) {
        break;
      }
    }
  }

  protected isConfigRootDir(dir: Path): boolean {
    if (dir.path() === this.root?.path()) {
      return true;
    }

    if (dir.append(CONFIG_FOLDER).exists()) {
      this.root = dir;

      return true;
    }

    return false;
  }
}
