export function interopModule(result: {
  [named: string]: unknown;
  default?: unknown;
  __esModule?: boolean;
}): unknown {
  const hasDefaultExport = 'default' in result;
  const namedExports = Object.keys(result).filter(
    (key) => key !== '__esModule' && key !== 'default',
  );

  // Default export only
  if (hasDefaultExport && namedExports.length === 0) {
    return result.default;
  }

  // Default AND named exports
  // Named exports only
  return result;
}
