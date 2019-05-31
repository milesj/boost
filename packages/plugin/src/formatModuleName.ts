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
