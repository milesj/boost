/* eslint-disable no-underscore-dangle, node/no-deprecated-api */

import fs from 'fs';
import type Module from 'module';
import interopRequireModule from '../internal/interopRequireModule';
import { PortablePath } from '../types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Module {
      _compile: (code: string, file: string) => unknown;
    }
  }
}

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
      allowJs: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      noEmit: true,
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2016,
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

// https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js#L1103
// https://github.com/TypeStrong/ts-node/blob/master/src/index.ts#L1071
function registerExtensions() {
  require.extensions['.ts'] = transformHandler;
  require.extensions['.tsx'] = transformHandler;
}

function unregisterExtensions() {
  delete require.extensions['.ts'];
  delete require.extensions['.tsx'];
}

export default function requireTypedModule<T>(path: PortablePath): T {
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
