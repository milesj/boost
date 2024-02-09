import { requireModule } from '../src/requireModule';
import { getFixture } from './helpers';
import { vi } from 'vitest';

vi.mock('cjs-null', () => null, { virtual: true });
vi.mock('cjs-default', () => 123, { virtual: true });
vi.mock('cjs-default-object', () => ({ foo: 'bar' }), { virtual: true });
vi.mock('cjs-pseudo-default', () => ({ default: 123 }), { virtual: true });
vi.mock('cjs-named', () => ({ named: 'abc' }), { virtual: true });
vi.mock('esm-default', () => ({ __esModule: true, default: 456 }), { virtual: true });
vi.mock('esm-named', () => ({ __esModule: true, named: 'abc' }), { virtual: true });
vi.mock('esm-both', () => ({ __esModule: true, default: 456, named: 'abc' }), {
	virtual: true,
});

vi.mock('../src/requireTSModule', () => ({
	requireTSModule: () => 'ts',
}));

describe('requireModule()', () => {
	describe('commonjs', () => {
		it('returns null value under default property', () => {
			expect(requireModule<null>('cjs-null')).toEqual({ default: null });
		});

		it('returns primitive value under default property', () => {
			expect(requireModule<123>('cjs-default')).toEqual({ default: 123 });
		});

		it('returns object under default property', () => {
			expect(requireModule<{ foo: string }>('cjs-default-object')).toEqual({
				foo: 'bar',
				default: { foo: 'bar' },
			});
		});

		it('returns object with default property as-is', () => {
			expect(requireModule<123>('cjs-pseudo-default').default).toBe(123);
		});

		it('returns named vales as-is and on default property', () => {
			expect(requireModule<void, { named: string }>('cjs-named')).toEqual({
				named: 'abc',
				default: { named: 'abc' },
			});
		});
	});

	describe('esmodules', () => {
		it('returns default as-is', () => {
			expect(requireModule('esm-default')).toEqual({ __esModule: true, default: 456 });
		});

		it('returns named as-is', () => {
			expect(requireModule('esm-named')).toEqual({ __esModule: true, named: 'abc' });
		});

		it('returns default and named as-is', () => {
			expect(requireModule('esm-both')).toEqual({ __esModule: true, default: 456, named: 'abc' });
		});
	});

	it('calls `requireTypedModule` when a .ts file or .tsx file', () => {
		expect(requireModule('some-fake-ts-file.ts')).toBe('ts');
	});

	describe('formats', () => {
		it('can load .js files', () => {
			expect(requireModule(getFixture('format-js.js'))).toEqual({ default: 'default' });
		});

		it('can load .cjs files', () => {
			expect(requireModule(getFixture('format-cjs.cjs'))).toEqual({
				a: 1,
				b: 2,
				c: 3,
				default: {
					a: 1,
					b: 2,
					c: 3,
				},
			});
		});

		it('cannot load .mjs files', () => {
			// eslint-disable-next-line jest/require-to-throw-message
			expect(() => requireModule(getFixture('format-mjs.mjs'))).toThrow();
		});

		// Unable to test .ts, .tsx because of Jest require patching
	});
});
