/* eslint-disable no-underscore-dangle, node/no-deprecated-api */

import fs from 'fs';
import type Module from 'module';
import { PathLike } from '../types';
import { COMPILER_OPTIONS, getTargetFromNodeVersion } from '../typescript';
import { interopRequireModule } from './interopRequireModule';

let tsInstance: typeof import('typescript') | null = null;

function loadTypeScript() {
  if (!tsInstance) {
    try {
      // eslint-disable-next-line
      tsInstance = require('typescript');
    } catch {
      // Ignore and check at runtime
    }
  }

  return tsInstance;
}

const transformCache = new Map<string, string>();

function transform(contents: string, filePath: string): string {
  const ts = loadTypeScript();

  if (!ts) {
    throw new Error(`\`typescript\` package required for transforming file "${filePath}".`);
  }

  return ts.transpileModule(contents, {
    compilerOptions: {
      ...COMPILER_OPTIONS,
      module: ts.ModuleKind.CommonJS,
      resolveJsonModule: true,
      target: getTargetFromNodeVersion(ts),
    },
    fileName: filePath,
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

export function requireTSModule<T>(path: PathLike): T {
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
