/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import path from 'path';

/**
 * Resolve a Node/NPM module path to an app config file.
 */
export default function resolveModuleConfigPath(
  appName: string,
  moduleName: string,
  preset: boolean = true,
): string {
  const fileName = preset ? `${appName}.preset.js` : `${appName}.js`;

  return path.resolve('node_modules', moduleName, `config/${fileName}`);
}
