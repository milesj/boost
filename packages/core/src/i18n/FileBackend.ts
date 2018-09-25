/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import fs from 'fs';
import i18next from 'i18next';

export interface FileBackendOptions {
  localePaths: string[];
}

export default class FileBackend {
  options: FileBackendOptions = {
    localePaths: [],
  };

  type: string = 'backend';

  constructor(services: any, options: Partial<FileBackendOptions> = {}) {
    this.init(services, options);
  }

  init(services: any, options: Partial<FileBackendOptions> = {}) {
    this.services = services;
    this.options = { ...this.options, ...options };
  }

  read(
    language: string,
    namespace: string,
    callback: (error: Error | null, resources: any) => void,
  ): i18next.ResourceKey {
    let messages = {};

    this.options.localePaths.forEach(localePath => {
      const filePath = this.services.interpolator.interpolate(localePath, {
        lng: language,
        ns: namespace,
      });

      if (fs.existsSync(filePath)) {
        const contents = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        messages = {
          ...messages,
          ...contents,
        };
      }
    });

    callback(null, messages);

    return messages;
  }
}
