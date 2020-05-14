import { Path, Predicates } from '@boost/common';
import Finder from './Finder';
import readFile from './helpers/readFile';
import { IgnoreFinderOptions, IgnoreFile } from './types';

export default class IgnoreFinder extends Finder<IgnoreFile, IgnoreFinderOptions> {
  blueprint({ string }: Predicates) {
    return {
      name: string()
        .required()
        .camelCase(),
    };
  }

  /**
   * Find a single ignore file in the provided directory.
   */
  findFilesInDir(dir: Path): Promise<Path[]> {
    const files: Path[] = [];
    const path = dir.append(this.getFileName());

    if (path.exists()) {
      files.push(path);
    }

    return Promise.resolve(files);
  }

  /**
   * Return an ignore specific file.
   */
  getFileName(): string {
    return `.${this.options.name.toLowerCase()}ignore`;
  }

  /**
   * Load and parse a list of found files into a list of ignore patterns.
   */
  async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<IgnoreFile[]> {
    return Promise.all(
      foundFiles.map(async filePath => {
        const contents = await this.cache.cacheFileContents(filePath, () => readFile(filePath));
        const ignore = contents
          .split('\n')
          .map(line => line.trim())
          .filter(line => line !== '' && !line.startsWith('#'));

        return {
          ignore,
          path: filePath,
          source: this.isRootDir(filePath.parent(), true) ? ('root' as const) : ('branch' as const),
        };
      }),
    );
  }
}
