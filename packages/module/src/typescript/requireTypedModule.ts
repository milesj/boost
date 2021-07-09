/* eslint-disable no-underscore-dangle, node/no-deprecated-api */

import fs from 'fs';
import type Module from 'module';
import { interopRequireModule } from '../interopRequireModule';
import { PathLike } from '../types';
import { COMPILER_OPTIONS, getTargetFromNodeVersion } from './helpers';

let ts: typeof import('typescript') | null = null;

try {
  // eslint-disable-next-line
  ts = require('typescript');
} catch {
  // Ignore and check at runtime
}

const transformCache = new Map<string, string>();

function transform(contents: string, fileName: string): string {
  if (!ts) {
    throw new Error(`\`typescript\` package required for importing file "${fileName}".`);
  }

  return ts.transpileModule(contents, {
    compilerOptions: {
      ...COMPILER_OPTIONS,
      module: ts.ModuleKind.CommonJS,
      target: getTargetFromNodeVersion(ts),
    },
    fileName,
  }).outputText;
}

function transformHandler(mod: Module, filePath: string) {
  let code = transformCache.get(filePath);

  if (!code) {
    code = transform(fs.readFileSync(filePath, 'utf8'), filePath);
    transformCache.set(filePath, code);
  }

  mod._compile(code, filePath);
}

function registerExtensions() {
  require.extensions['.ts'] = transformHandler;
  require.extensions['.tsx'] = transformHandler;
}

function unregisterExtensions() {
  delete require.extensions['.ts'];
  delete require.extensions['.tsx'];
}

export function requireTypedModule<T>(path: PathLike): T {
  const filePath = String(path);

  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    throw new Error(
      `Unable to import non-TypeScript file "${filePath}", use \`requireModule\` instead.`,
    );
  }

  registerExtensions();

  const result = interopRequireModule(filePath);

  unregisterExtensions();

  return result as T;
}
