import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import { Path } from '@boost/common';
import { Locale } from './types';

export interface FileBackendOptions {
  resourcePaths: Path[];
}

export default class FileBackend implements i18next.BackendModule {
  static type = 'backend';

  fileCache: { [path: string]: i18next.ResourceKey } = {};

  options: FileBackendOptions = {
    resourcePaths: [],
  };

  init(services: i18next.Services, options: Partial<FileBackendOptions>) {
    this.options = { ...this.options, ...options };
  }

  create() {
    // We dont need this
  }

  read(
    locale: Locale,
    namespace: string,
    callback: (error: Error | null, resources: i18next.ResourceLanguage) => void,
  ): i18next.ResourceKey {
    const resources: i18next.ResourceLanguage = {};

    this.options.resourcePaths.forEach(resourcePath => {
      const filePath = path.join(resourcePath, locale, `${namespace}.json`);

      if (!this.fileCache[filePath] && fs.existsSync(filePath)) {
        this.fileCache[filePath] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      Object.assign(resources, this.fileCache[filePath]);
    });

    callback(null, { [namespace]: resources });

    return resources;
  }
}
