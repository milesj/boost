// https://nodejs.org/api/esm.html#esm_loaders

import fs from 'fs';
import {
  COMPILER_OPTIONS,
  getModuleFromNodeVersion,
  getTargetFromNodeVersion,
} from '../typescript';

function isTypeScript(url: string) {
  return url.endsWith('.ts') || url.endsWith('.tsx');
}

function loadTypeScript() {
  return import('typescript').catch(() => null);
}

export async function resolve(
  specifier: string,
  context: { conditions: string[]; parentURL?: string },
  defaultResolve: typeof resolve,
): Promise<{ url: string }> {
  if (isTypeScript(specifier)) {
    return {
      url: new URL(specifier, context.parentURL).href,
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function getFormat(
  url: string,
  context: object,
  defaultGetFormat: typeof getFormat,
): Promise<{ format: string }> {
  if (isTypeScript(url)) {
    return {
      format: 'module',
    };
  }

  return defaultGetFormat(url, context, defaultGetFormat);
}

export async function getSource(
  url: string,
  context: object,
  defaultGetSource: typeof getSource,
): Promise<{ source: SharedArrayBuffer | Uint8Array | string }> {
  if (isTypeScript(url)) {
    return {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      source: await fs.promises.readFile(url, 'utf8'),
    };
  }

  return defaultGetSource(url, context, defaultGetSource);
}

export async function transformSource(
  source: SharedArrayBuffer | Uint8Array | string,
  context: { format: string; url: string },
  defaultTransformSource: typeof transformSource,
): Promise<{ source: string }> {
  const { url } = context;

  if (isTypeScript(url)) {
    const ts = await loadTypeScript();

    if (!ts) {
      throw new Error(`\`typescript\` package required for transforming file "${url}".`);
    }

    return {
      source: ts.transpileModule(String(source), {
        compilerOptions: {
          ...COMPILER_OPTIONS,
          module: getModuleFromNodeVersion(ts),
          resolveJsonModule: false,
          target: getTargetFromNodeVersion(ts),
        },
        fileName: url,
      }).outputText,
    };
  }

  return defaultTransformSource(source, context, defaultTransformSource);
}
