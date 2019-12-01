export default function formatModuleName(
  toolName: string,
  typeName: string,
  moduleName: string,
  scoped: boolean = false,
): string {
  if (scoped) {
    return `@${toolName}/${typeName}-${moduleName}`;
  }

  return `${toolName}-${typeName}-${moduleName}`;
}
