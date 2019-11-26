import { BackendModule, Resource, ResourceKey } from 'i18next';
import { parseFile, Contract, Path, Predicates } from '@boost/common';
import { RuntimeError } from '@boost/internal';
import { Locale, Format } from './types';

const EXTS: { [K in Format]: string[] } = {
  js: ['js'],
  json: ['json', 'json5'],
  yaml: ['yaml', 'yml'],
};

export interface FileBackendOptions {
  format?: Format;
  paths?: Path[];
}

export default class FileBackend extends Contract<FileBackendOptions> implements BackendModule {
  fileCache: Map<Path, ResourceKey> = new Map();

  type: 'backend' = 'backend';

  init(services: unknown, options: Partial<FileBackendOptions>) {
    this.configure(options);

    // Validate resource paths are directories
    this.options.paths.forEach(path => {
      if (path.exists() && !path.isDirectory()) {
        throw new RuntimeError('translate', 'TL_INVALID_RES_PATH', [path.path()]);
      }
    });
  }

  blueprint({ array, instance, string }: Predicates) /* infer */ {
    return {
      format: string('yaml').oneOf(['js', 'json', 'yaml']),
      // @ts-ignore TODO: Fix upstream
      paths: array<Path>(instance(Path, true)),
    };
  }

  // istanbul ignore next
  create() {
    // We don't need this but is required by the interface
  }

  read(
    locale: Locale,
    namespace: string,
    callback: (error: Error | null, resources: Resource) => void,
  ): ResourceKey {
    const { format, paths } = this.options;
    const resources: ResourceKey = {};

    paths.forEach(path => {
      EXTS[format].some(ext => {
        const resPath = path.append(locale, `${namespace}.${ext}`);
        const isCached = this.fileCache.has(resPath);

        if (!resPath.exists()) {
          return false;
        }

        if (!isCached) {
          this.fileCache.set(resPath, parseFile(resPath));
        }

        Object.assign(resources, this.fileCache.get(resPath));

        return true;
      });
    });

    callback(null, resources);

    return resources;
  }
}
