/* eslint-disable no-magic-numbers, sort-keys */

export interface ColorFormatter {
  (message: string | { toString: () => string }): string;
}

// https://github.com/chalk/ansi-styles/blob/master/index.js#L75
function createColor(open: number): ColorFormatter {
  return (message) => `\u001B[${open}m${String(message)}\u001B[39m`;
}

export default {
  // States
  fail: createColor(31),
  mute: createColor(90),
  pass: createColor(32),
  // Types
  filePath: createColor(36),
  moduleName: createColor(33),
  projectName: createColor(34),
  symbol: createColor(35),
};
