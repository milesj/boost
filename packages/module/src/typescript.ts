/* eslint-disable no-magic-numbers */

export type TS = typeof import('typescript');

export const COMPILER_OPTIONS = {
  allowJs: true,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  noEmit: true,
};

export function getTargetFromNodeVersion(ts: TS) {
  const version = Number.parseFloat(process.version);

  if (version >= 16) {
    return ts.ScriptTarget.ES2020;
  } else if (version >= 15) {
    return ts.ScriptTarget.ES2019;
  } else if (version >= 14) {
    return ts.ScriptTarget.ES2018;
  } else if (version >= 13) {
    return ts.ScriptTarget.ES2017;
  } else if (version >= 12) {
    return ts.ScriptTarget.ES2016;
  }

  return ts.ScriptTarget.ES5;
}
