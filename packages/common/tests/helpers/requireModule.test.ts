import { requireModule } from '../../src/helpers/requireModule';

jest.mock('example', () => 123, { virtual: true });
jest.mock('example-es-default', () => ({ __esModule: true, default: 456 }), { virtual: true });
jest.mock('example-es-default-named', () => ({ __esModule: true, default: 456, named: 'abc' }), {
	virtual: true,
});
jest.mock('example-es-named', () => ({ __esModule: true, a: 1, b: 2, c: 3 }), { virtual: true });

jest.mock('../../src/helpers/requireTypedModule', () => () => 'ts');

describe('requireModule()', () => {
	it('returns default exported', () => {
		expect(requireModule('example')).toBe(123);
	});

	it('calls `requireTypedModule` when a .ts file or .tsx file', () => {
		expect(requireModule('some-fake-ts-file.ts')).toBe('ts');
	});

	describe('es modules', () => {
		it('returns default export directly when no named', () => {
			expect(requireModule('example-es-default')).toBe(456);
		});

		it('returns default and named exports', () => {
			expect(requireModule('example-es-default-named')).toEqual(
				expect.objectContaining({
					default: 456,
					named: 'abc',
				}),
			);
		});

		it('returns named exports', () => {
			expect(requireModule('example-es-named')).toEqual(
				expect.objectContaining({
					a: 1,
					b: 2,
					c: 3,
				}),
			);
		});
	});
});
