/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import fs from 'fs-extra';
import path from 'path';
import i18next from 'i18next';

export interface FileBackendOptions {
  resourcePaths: string[];
}

export default class FileBackend {
  fileCache: { [path: string]: i18next.ResourceKey } = {};

  options: FileBackendOptions = {
    resourcePaths: [],
  };

  services: any = {};

  type: string = 'backend';

  init(services: any, options: Partial<FileBackendOptions>) {
    this.services = services;
    this.options = { ...this.options, ...options };
  }

  read(
    language: string,
    namespace: string,
    callback: (error: Error | null, resources: any) => void,
  ): i18next.ResourceKey {
    let resources = {};

    this.options.resourcePaths.forEach(resourcePath => {
      const filePath = this.services.interpolator.interpolate(
        path.join(resourcePath, '{{language}}/{{namespace}}.json'),
        {
          language,
          namespace,
        },
      );
      let contents = {};

      if (this.fileCache[filePath]) {
        contents = this.fileCache[filePath];
      } else if (fs.existsSync(filePath)) {
        contents = fs.readJsonSync(filePath);
        this.fileCache[filePath] = contents;
      }

      resources = {
        ...resources,
        ...contents,
      };
    });

    callback(null, resources);

    return resources;
  }
}
