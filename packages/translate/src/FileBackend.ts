import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import { parseFile, Contract, Path, Predicates } from '@boost/common';
import { Locale, Format } from './types';

const EXTS: { [K in Format]: string[] } = {
  js: ['js', 'mjs'],
  json: ['json', 'json5'],
  yaml: ['yml', 'yaml'],
};

export interface FileBackendOptions {
  format?: Format;
  paths?: Path[];
}

export default class FileBackend extends Contract<FileBackendOptions>
  implements i18next.BackendModule {
  fileCache: { [path: string]: i18next.ResourceKey } = {};

  type: 'backend' = 'backend';

  init(services: i18next.Services, options: Partial<FileBackendOptions>) {
    this.setOptions(options);

    // Validate resource paths are directories
    this.options.paths.forEach(resourcePath => {
      const stats = fs.statSync(resourcePath);

      if (!stats.isDirectory()) {
        throw new Error(`Resource path "${resourcePath}" must be a directory.`);
      }
    });
  }

  blueprint({ array, string }: Predicates) /* infer */ {
    return {
      format: string('json').oneOf(['js', 'json', 'yaml']),
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
        const filePath = path.join(resourcePath, locale, `${namespace}.${ext}`);

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

    callback(null, { [namespace]: resources });

    return resources;
  }
}