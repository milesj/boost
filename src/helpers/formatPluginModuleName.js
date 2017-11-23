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
  scoped: boolean = false,
): string {
  const moduleName = name.toLowerCase()
    .replace('plugin:', '')
    .replace(`${pluginName}:`, '');

  if (scoped) {
    return `@${appName}/${pluginName}-${moduleName}`;
  }

  return `${appName}-${pluginName}-${moduleName}`;
}
