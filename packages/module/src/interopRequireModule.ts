/* eslint-disable no-underscore-dangle */

export function interopRequireModule(path: string): unknown {
  // eslint-disable-next-line
  const result = require(path) as {
    [named: string]: unknown;
    default?: unknown;
    __esModule?: boolean;
  };

  // Not a Babel/TypeScript transpiled module
  if (!result.__esModule) {
    return result;
  }

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
