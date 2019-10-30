import fs from 'fs';
import path from 'path';
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
  fileCache: { [path: string]: ResourceKey } = {};

  type: 'backend' = 'backend';

  init(services: unknown, options: Partial<FileBackendOptions>) {
    this.configure(options);

    // Validate resource paths are directories
    this.options.paths.forEach(resourcePath => {
      if (fs.existsSync(resourcePath) && !fs.statSync(resourcePath).isDirectory()) {
        throw new RuntimeError('translate', 'TL_INVALID_RES_PATH', [resourcePath]);
      }
    });
  }

  blueprint({ array, string }: Predicates) /* infer */ {
    return {
      format: string('yaml').oneOf(['js', 'json', 'yaml']),
      paths: array(string()),
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

    paths.forEach(resourcePath => {
      EXTS[format].some(ext => {
        const filePath = path.normalize(path.join(resourcePath, locale, `${namespace}.${ext}`));

        if (!this.fileCache[filePath] && !fs.existsSync(filePath)) {
          return false;
        }

        Object.assign(
          resources,
          this.fileCache[filePath] || (this.fileCache[filePath] = parseFile(filePath)),
        );

        return true;
      });
    });

    callback(null, resources);

    return resources;
  }
}
