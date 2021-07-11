import mergePlugins from '../../src/helpers/mergePlugins';

describe('mergePlugins()', () => {
	describe('objects', () => {
		it('returns a merged object', () => {
			expect(mergePlugins({ foo: true }, { bar: true })).toEqual({ foo: true, bar: true });
		});

		it('plugins of same name overwrite', () => {
			expect(mergePlugins({ foo: true }, { foo: false })).toEqual({ foo: false });
		});

		it('plugin options are merged', () => {
			expect(mergePlugins({ foo: { debug: true }, bar: true }, { foo: { debug: false } })).toEqual({
				foo: { debug: false },
				bar: true,
			});
		});

		it('plugin options overwrite booleans', () => {
			expect(mergePlugins({ foo: true }, { foo: { debug: false } })).toEqual({
				foo: { debug: false },
			});
		});

		it('undefined plugin options are skipped', () => {
			expect(
				mergePlugins(
					{ foo: true },
					{
						// @ts-expect-error
						foo: undefined,
					},
				),
			).toEqual({ foo: true });
		});
	});

	describe('arrays', () => {
		it('returns a merged object', () => {
			expect(mergePlugins(['foo'], ['bar'])).toEqual({ foo: true, bar: true });
		});

		it('plugins of same name are deduped', () => {
			expect(mergePlugins(['foo'], ['foo'])).toEqual({ foo: true });
		});

		it('plugins of same name can be turned off using a tuple', () => {
			expect(mergePlugins(['foo'], [['foo', false]])).toEqual({ foo: false });
		});

		it('plugin options are merged', () => {
			expect(mergePlugins([['foo', { debug: true }], 'bar'], [['foo', { debug: false }]])).toEqual({
				foo: { debug: false },
				bar: true,
			});
		});

		it('undefined plugin options are converted to a boolean true', () => {
			expect(
				mergePlugins(
					['foo'],
					// @ts-expect-error
					[['bar', undefined]],
				),
			).toEqual({ foo: true, bar: true });
		});
	});

	describe('objects + arrays', () => {
		it('supports a list on the left', () => {
			expect(mergePlugins(['foo'], { bar: {} })).toEqual({ foo: true, bar: {} });
		});

		it('supports a list on the right', () => {
			expect(mergePlugins({ foo: true, bar: false }, ['bar'])).toEqual({ foo: true, bar: true });
		});

		it('merges tuple and object options', () => {
			expect(
				mergePlugins({ foo: { debug: true }, bar: false, baz: true, qux: {} }, [
					['foo', { debug: false }],
					'bar',
					['baz', false],
				]),
			).toEqual({
				foo: { debug: false },
				bar: true,
				baz: false,
				qux: {},
			});
		});
	});
});
