/* eslint-disable node/no-deprecated-api */
/* eslint-disable no-underscore-dangle */

const fs = require('fs');
const Module = require('module');

let ts = null;

try {
  // eslint-disable-next-line
  ts = require('typescript');
} catch {
  // Ignore and check at runtime
}

const transformCache = new Map();

function transform(contents, fileName) {
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

function transformHandler(mod, filePath) {
  console.log('transformHandler', filePath, mod);

  let code = transformCache.get(filePath);

  if (!code) {
    code = transform(fs.readFileSync(filePath, 'utf8'), filePath);
    transformCache.set(filePath, code);
    console.log(code);
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

function requireTypedModule(path) {
  const filePath = String(path);

  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    throw new Error(
      `Unable to import non-TypeScript file "${filePath}", use \`requireModule\` instead.`,
    );
  }

  registerExtensions();

  // eslint-disable-next-line
  const result = require(filePath);

  unregisterExtensions();

  return result;
}

const f = requireTypedModule('./__fixtures__/other-imports.ts');

console.log(f.default.constructor === Object);
console.log(f.__esModule, f.default, Object.keys(f));
