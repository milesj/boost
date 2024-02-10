// This file is necessary for testing as it's not possible within Jest.
// Most likely because of its custom module and mocking layer.

import { strict as assert } from 'assert';
import path from 'path';

// ES imports return modules wrapped in a `Module` class, which fails assertions.
// We have no way of instantiating those classes, so spread to return a simple object.
function unwrap(mod) {
	const obj = { ...mod };

	Object.entries(obj).forEach(([key, value]) => {
		if (value && typeof value === 'object') {
			obj[key] = unwrap(value);
		}
	});

	return { ...obj };
}

function getFixture(file) {
	return path.join(path.dirname(import.meta.url), '__fixtures__', file);
}

function getFormatFixture(type) {
	return getFixture(`format-${type}.${type}`);
}

async function test() {
	// FORMATS

	// JS
	assert.deepEqual(unwrap(await import(getFormatFixture('js'))), { default: 'default' });

	// CJS
	assert.deepEqual(
		unwrap(await import(getFormatFixture('cjs'))),
		parseFloat(process.version.slice(1)) < 12.2
			? {
					default: {
						a: 1,
						b: 2,
						c: 3,
					},
				}
			: // Support for named exports in CommonJS was added in 12.20+
				{
					a: 1,
					b: 2,
					c: 3,
					default: {
						a: 1,
						b: 2,
						c: 3,
					},
				},
	);

	// MJS
	assert.deepEqual(unwrap(await import(getFormatFixture('mjs'))), { default: 'default' });

	// TS
	assert.deepEqual(unwrap(await import(getFormatFixture('ts'))), { default: 'default' });

	// TSX
	assert.deepEqual(unwrap(await import(getFormatFixture('tsx'))), {
		a: 1,
		b: 2,
		c: 3,
	});

	// TYPESCRIPT

	// Default exports only
	assert.deepEqual(unwrap(await import(getFixture('default-export.ts'))), { default: 'default' });

	// Named exports only
	assert.deepEqual(unwrap(await import(getFixture('named-exports.ts'))), {
		a: 1,
		b: 2,
		c: 3,
	});

	// Default AND named exports
	assert.deepEqual(unwrap(await import(getFixture('default-named-exports.ts'))), {
		a: 1,
		b: 2,
		c: 3,
		default: 'default',
	});

	// Resolves nested imports
	assert.deepEqual(unwrap(await import(getFixture('imports.ts'))), {
		default: {
			defaultExport: 'default',
			defaultNamedExports: { a: 1, b: 2, c: 3, default: 'default' },
			namedExports: { a: 1, b: 2, c: 3 },
		},
	});
}

test().catch(console.error);
