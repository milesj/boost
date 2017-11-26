/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Combine app and plugin names into a Node/NPM applicable module name.
 */
export default function formatModuleName(
  appName: string,
  addonName: string,
  name: string,
  scoped: boolean = false,
): string {
  const moduleName = name.toLowerCase()
    .replace('plugin:', '')
    .replace(`${addonName}:`, '');

  if (scoped) {
    return `@${appName}/${addonName}-${moduleName}`;
  }

  return `${appName}-${addonName}-${moduleName}`;
}
