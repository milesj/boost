// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

import { strict as assert } from 'assert';
import path from 'path';
import { importModule } from '../lib/esmodule/importModule.js';

// FORMATS

function getFormatFixture(type) {
  return path.join(path.dirname(import.meta.url), `__fixtures__/format-${type}.${type}`);
}

// JS
assert.equal(await importModule(getFormatFixture('js')), 'default');

// CJS
assert.deepEqual(await importModule(getFormatFixture('cjs')), {
  a: 1,
  b: 2,
  c: 3,
});

// MJS
try {
  await importModule(getFormatFixture('mjs'));
} catch (error) {
  assert.equal(
    error.message,
    `Unable to require non-CommonJS file "${process.cwd()}/packages/module/tests/__fixtures__/format-mjs.mjs", use ES imports instead.`,
  );
}

// TS
assert.equal(await importModule(getFormatFixture('ts')), 'default');

// TSX
assert.deepEqual(await importModule(getFormatFixture('tsx')), {
  a: 1,
  b: 2,
  c: 3,
});

// TYPESCRIPT

function getFixture(file) {
  return path.join(path.dirname(import.meta.url), '__fixtures__', file);
}

// Default exports only
assert.equal(await importModule(getFixture('default-export.ts')), 'default');

// Named exports only
assert.deepEqual(await importModule(getFixture('named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
});

// Default AND named exports
assert.deepEqual(await importModule(getFixture('default-named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
  default: 'default',
});

// Resolves nested imports
assert.deepEqual(await importModule(getFixture('imports.ts')), {
  defaultExport: 'default',
  defaultNamedExports: { a: 1, b: 2, c: 3, default: 'default' },
  namedExports: { a: 1, b: 2, c: 3 },
});

// Built-ins are the same
const obj = await importModule(getFixture('named-exports.ts'));
const objExp = {};

assert.equal(Object.getPrototypeOf(obj), Object.getPrototypeOf(objExp));
