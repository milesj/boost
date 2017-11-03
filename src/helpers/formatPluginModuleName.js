/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Combine app and plugin names into a Node/NPM applicable module name.
 */
export default function formatPluginModuleName(
  appName: string,
  pluginName: string,
  name: string,
): string {
  const moduleName = name.toLowerCase()
    .replace('plugin:', '')
    .replace(`${pluginName}:`, '');

  return `${appName}-${pluginName}-${moduleName}`;
}
