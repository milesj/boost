/* eslint-disable import/no-extraneous-dependencies, global-require */

import fs from 'fs';
import vm from 'vm';
import { Path } from '@boost/common';
import supportsBabel from './supports/babel';
import supportsTypeScript from './supports/typescript';
import supportsDynamicImport from './supports/import';

async function transformWithBabel(code: string, path: Path): Promise<string> {
  const babel = require('@babel/core') as typeof import('@babel/core');

  const result = await babel.transformAsync(code, {
    caller: { name: '@boost/config', supportsDynamicImport },
    comments: false,
    filename: path.path(),
    presets: [
      ['@babel/preset-env', { modules: false, targets: { node: 'current' } }],
      '@babel/preset-typescript',
    ],
    rootMode: 'upward-optional',
  });

  return result?.code || '';
}

function transformWithTypeScript(code: string, path: Path): string {
  const ts = require('typescript') as typeof import('typescript');

  const result = ts.transpileModule(code, {
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2015,
    },
    fileName: path.path(),
  });

  return result.outputText;
}

export default async function loadTs<T>(path: Path): Promise<T> {
  if (!supportsBabel && !supportsTypeScript) {
    throw new Error(
      'Unable to use `ts` loader. Requires either `@babel/core` or `typescript`, but neither dependency found.',
    );
  }

  const data = await fs.promises.readFile(path.path(), 'utf8');
  let code = '';

  if (supportsBabel) {
    code = await transformWithBabel(data, path);
  } else if (supportsTypeScript) {
    code = await transformWithTypeScript(data, path);
  }

  if (!code) {
    throw new Error(`Failed to transform source code for "${path}".`);
  }

  const context = { module: { exports: {} } };

  vm.runInNewContext(code, context, path.path());

  return (context.module.exports as unknown) as T;
}
