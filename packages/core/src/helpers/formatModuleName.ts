/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/**
 * Combine app and plugin names into a Node/NPM applicable module name.
 */
export default function formatModuleName(
  appName: string,
  pluginType: string,
  name: string,
  scoped: boolean = false,
): string {
  const moduleName = name.toLowerCase().replace(`${pluginType}:`, '');

  if (scoped) {
    return `@${appName}/${pluginType}-${moduleName}`;
  }

  return `${appName}-${pluginType}-${moduleName}`;
}
