export default function formatModuleName(
  toolName: string,
  pluginType: string,
  name: string,
  scoped: boolean = false,
): string {
  const moduleName = name.toLowerCase().replace(`${pluginType}:`, '');

  if (scoped) {
    return `@${toolName}/${pluginType}-${moduleName}`;
  }

  return `${toolName}-${pluginType}-${moduleName}`;
}
