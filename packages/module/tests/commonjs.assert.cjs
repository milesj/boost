// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

const path = require('path');
const assert = require('assert').strict;
const { requireModule } = require('../lib');

function getFixture(file) {
	return path.join(__dirname, '__fixtures__', file);
}

function getFormatFixture(type) {
	return getFixture(`format-${type}.${type}`);
}

// FORMATS

// JS
assert.deepEqual(requireModule(getFormatFixture('js')), { default: 'default' });

// CJS
assert.deepEqual(requireModule(getFormatFixture('cjs')), {
	a: 1,
	b: 2,
	c: 3,
	default: {
		a: 1,
		b: 2,
		c: 3,
	},
});

// MJS
try {
	requireModule(getFormatFixture('mjs'));
} catch (error) {
	assert.equal(
		error.message,
		`Unable to require non-CommonJS file "${path.join(
			process.cwd(),
			'packages',
			'module',
			'tests',
			'__fixtures__',
			'format-mjs.mjs',
		)}", use ESM imports instead.`,
	);
}

// TS
assert.deepEqual(requireModule(getFormatFixture('ts')), { default: 'default' });

// TSX
assert.deepEqual(requireModule(getFormatFixture('tsx')), {
	a: 1,
	b: 2,
	c: 3,
});

// TYPESCRIPT

// Default exports only
assert.deepEqual(requireModule(getFixture('default-export.ts')), { default: 'default' });

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
	default: {
		defaultExport: 'default',
		defaultNamedExports: { a: 1, b: 2, c: 3, default: 'default' },
		namedExports: { a: 1, b: 2, c: 3 },
	},
});

// Built-ins are the same
const obj = requireModule(getFixture('named-exports.ts'));
const objExp = {};

assert.equal(Object.getPrototypeOf(obj), Object.getPrototypeOf(objExp));
