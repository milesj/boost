export default function formatModuleName(
  baseName: string,
  pluginType: string,
  name: string,
  scoped: boolean = false,
): string {
  const moduleName = name.toLowerCase().replace(`${pluginType}:`, '');

  if (scoped) {
    return `@${baseName}/${pluginType}-${moduleName}`;
  }

  return `${baseName}-${pluginType}-${moduleName}`;
}
