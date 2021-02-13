/* eslint-disable no-underscore-dangle */

export default function interopRequireModule(path: string): unknown {
  // eslint-disable-next-line
  const result = require(path) as {
    __esModule: boolean;
    default?: unknown;
  };

  // Not a Babel/TypeScript transpiled module
  if (!result.__esModule) {
    return result;
  }

  const hasDefault = 'default' in result;
  const namedExportCount = Object.keys(result).length - (hasDefault ? 1 : 0);

  // Default export only
  if (hasDefault && namedExportCount === 0) {
    return result.default;
  }

  // Default AND named exports
  // Named exports only
  return result;
}
