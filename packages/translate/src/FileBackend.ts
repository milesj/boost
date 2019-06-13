import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import { parseFile, Contract, Path, Predicates } from '@boost/common';
import { Locale, Format } from './types';

const EXTS: { [K in Format]: string[] } = {
  js: ['js'],
  json: ['json5', 'json'],
  yaml: ['yaml', 'yml'],
};

export interface FileBackendOptions {
  format?: Format;
  paths?: Path[];
}

export default class FileBackend extends Contract<FileBackendOptions>
  implements i18next.BackendModule {
  fileCache: { [path: string]: i18next.ResourceKey } = {};

  type: 'backend' = 'backend';

  init(services: unknown, options: Partial<FileBackendOptions>) {
    this.configure(options);

    // Validate resource paths are directories
    this.options.paths.forEach(resourcePath => {
      if (fs.existsSync(resourcePath) && !fs.statSync(resourcePath).isDirectory()) {
        throw new Error(`Resource path "${resourcePath}" must be a directory.`);
      }
    });
  }

  blueprint({ array, string }: Predicates) /* infer */ {
    return {
      format: string('yaml').oneOf(['js', 'json', 'yaml']),
      paths: array(string()),
    };
  }

  create() {
    // We don't need this but is required by the interface
  }

  read(
    locale: Locale,
    namespace: string,
    callback: (error: Error | null, resources: i18next.ResourceLanguage) => void,
  ): i18next.ResourceKey {
    const { format, paths } = this.options;
    const resources: i18next.ResourceKey = {};

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
