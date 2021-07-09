// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

const path = require('path');
const assert = require('assert').strict;
const { requireModule } = require('../lib/requireModule');

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

// TS
assert.equal(requireModule(getFormatFixture('ts')), 'default');

// TSX
assert.deepEqual(requireModule(getFormatFixture('tsx')), {
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
