// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

const path = require('path');
const assert = require('assert').strict;
const { requireModule } = require('../lib/commonjs');

// FORMATS

function getFormatFixture(type) {
  return path.join(__dirname, `__fixtures__/format-${type}.${type}`);
}

// JS
assert.equal(requireModule(getFormatFixture('js')), 'default');

// CJS
assert.deepEqual(requireModule(getFormatFixture('cjs')), {
  a: 1,
  b: 2,
  c: 3,
});

// MJS
try {
  requireModule(getFormatFixture('mjs'));
} catch (error) {
  assert.equal(
    error.message,
    `Unable to require non-CommonJS file "${process.cwd()}/packages/module/tests/__fixtures__/format-mjs.mjs", use ES imports instead.`,
  );
}

// TS
assert.equal(requireModule(getFormatFixture('ts')), 'default');

// TSX
assert.deepEqual(requireModule(getFormatFixture('tsx')), {
  a: 1,
  b: 2,
  c: 3,
});

// TYPESCRIPT

function getFixture(file) {
  return path.join(__dirname, '__fixtures__', file);
}

// Default exports only
assert.equal(requireModule(getFixture('default-export.ts')), 'default');

// Named exports only
assert.deepEqual(requireModule(getFixture('named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
});

// Default AND named exports
assert.deepEqual(requireModule(getFixture('default-named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
  default: 'default',
});

// Resolves nested imports
assert.deepEqual(requireModule(getFixture('imports.ts')), {
  defaultExport: 'default',
  defaultNamedExports: { a: 1, b: 2, c: 3, default: 'default' },
  namedExports: { a: 1, b: 2, c: 3 },
});

// Built-ins are the same
const obj = requireModule(getFixture('named-exports.ts'));
const objExp = {};

assert.equal(Object.getPrototypeOf(obj), Object.getPrototypeOf(objExp));
