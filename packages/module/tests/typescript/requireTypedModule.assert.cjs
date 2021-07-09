// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

const path = require('path');
const assert = require('assert').strict;
const { requireTypedModule } = require('../../lib/typescript/requireTypedModule');

function getFixture(file) {
  return path.join(__dirname, '../__fixtures__', file);
}

// Default exports only
assert.equal(requireTypedModule(getFixture('default-export.ts')), 'default');

// Named exports only
assert.deepEqual(requireTypedModule(getFixture('named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
});

// Default AND named exports
assert.deepEqual(requireTypedModule(getFixture('default-named-exports.ts')), {
  a: 1,
  b: 2,
  c: 3,
  default: 'default',
});

// Resolves nested imports
assert.deepEqual(requireTypedModule(getFixture('imports.ts')), {
  defaultExport: 'default',
  defaultNamedExports: { a: 1, b: 2, c: 3, default: 'default' },
  namedExports: { a: 1, b: 2, c: 3 },
});

// Built-ins are the same
const obj = requireTypedModule(getFixture('named-exports.ts'));
const objExp = {};

assert.equal(Object.getPrototypeOf(obj), Object.getPrototypeOf(objExp));
