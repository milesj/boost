import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Blueprint, schemas } from '@boost/common/optimal';
import { mockFilePath } from '@boost/common/test';
import { mergeExtends } from '../src/helpers/mergeExtends';
import { mergePlugins } from '../src/helpers/mergePlugins';
import { overwrite } from '../src/helpers/overwrite';
import { Processor } from '../src/Processor';
import { createExtendsSchema, createOverridesSchema, createPluginsSchema } from '../src/schemas';
import type { ConfigFile, ExtendsSetting, OverridesSetting, PluginsSetting } from '../src/types';

describe('Processor', () => {
	interface ConfigShape {
		// Settings
		debug: boolean;
		extends: ExtendsSetting;
		plugins: PluginsSetting;
		overrides: OverridesSetting<Omit<ConfigShape, 'extends' | 'overrides'>>;
		// Types
		boolean: boolean;
		string: string;
		stringList: string[];
		number: number;
		numberList: number[];
		object: object;
	}

	let processor: Processor<ConfigShape>;

	function stubConfigFile(config: Partial<ConfigShape>): ConfigFile<ConfigShape> {
		return {
			config,
			path: mockFilePath('.boost.js'),
			source: 'branch',
		};
	}

	beforeEach(() => {
		processor = new Processor({ name: 'boost' });
	});

	describe('handlers', () => {
		it('sets a handler', () => {
			const spy = vi.fn();
			processor.addHandler('debug', spy);

			expect(processor.getHandler('debug')).toBe(spy);
		});

		it('overwrites a handler of the same name', () => {
			const spy1 = vi.fn();
			processor.addHandler('debug', spy1);

			const spy2 = vi.fn();
			processor.addHandler('debug', spy2);

			expect(processor.getHandler('debug')).toBe(spy2);
		});

		it('returns null if not defined', () => {
			expect(processor.getHandler('debug')).toBeNull();
		});
	});

	describe('processing', () => {
		const commonBlueprint = {
			debug: schemas.bool(false),
			plugins: createPluginsSchema(),
			boolean: schemas.bool(true),
			string: schemas.string(''),
			stringList: schemas.array(['foo']).of(schemas.string()),
			number: schemas.number(123),
			numberList: schemas.array([]).of(schemas.number()),
			object: schemas.object(),
		};

		const blueprint: Blueprint<ConfigShape> = {
			...commonBlueprint,
			extends: createExtendsSchema(),
			overrides: createOverridesSchema(commonBlueprint),
		};

		const defaults: ConfigShape = {
			debug: false,
			extends: [],
			plugins: {},
			overrides: [],
			boolean: true,
			string: '',
			stringList: ['foo'],
			number: 123,
			numberList: [],
			object: {},
		};

		it('returns defaults if no configs', async () => {
			await expect(processor.process(defaults, [], blueprint)).resolves.toEqual(defaults);
		});

		describe('undefined values', () => {
			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});

			it('does not reset to default if `defaultWhenUndefined` option is false', async () => {
				processor.configure({ defaultWhenUndefined: false });

				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					debug: undefined,
				});
			});
		});

		describe('validation', () => {
			it('validates each config', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ debug: true }),
							stubConfigFile({
								// @ts-expect-error Invalid type
								debug: 123,
							}),
						],
						blueprint,
					),
				).rejects.toThrowErrorMatchingSnapshot();
			});

			it('doesnt validate if the `validate` option is false', async () => {
				processor.configure({ validate: false });

				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ debug: true }),
							stubConfigFile({
								// @ts-expect-error Invalid type
								debug: 123,
							}),
						],
						blueprint,
					),
				).resolves.not.toThrow();
			});
		});

		describe('extends setting', () => {
			it('supports extends from multiple configs', async () => {
				processor.addHandler('extends', mergeExtends);

				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ extends: 'foo' }),
							stubConfigFile({ extends: ['bar', './baz.js'] }),
							stubConfigFile({ extends: '/qux.js' }),
						],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					extends: ['foo', 'bar', './baz.js', '/qux.js'],
				});
			});

			it('errors for an invalid value', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({
								// @ts-expect-error Invalid type
								extends: 123,
							}),
						],
						blueprint,
					),
				).rejects.toThrowErrorMatchingSnapshot();
			});

			it('errors for an empty string', async () => {
				await expect(
					processor.process(defaults, [stubConfigFile({ extends: '' })], blueprint),
				).rejects.toThrowErrorMatchingSnapshot();
			});

			it('errors for an empty string in an array', async () => {
				await expect(
					processor.process(defaults, [stubConfigFile({ extends: ['foo', ''] })], blueprint),
				).rejects.toThrowErrorMatchingSnapshot();
			});
		});

		describe('plugins setting', () => {
			it('supports plugins from multiple configs', async () => {
				processor.addHandler('plugins', mergePlugins);

				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ plugins: { foo: true, qux: { on: true } } }),
							stubConfigFile({ plugins: [['bar', false]] }),
							stubConfigFile({ plugins: { foo: { legacy: true }, baz: true, qux: { on: false } } }),
							stubConfigFile({ plugins: ['oop'] }),
						],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					plugins: {
						foo: { legacy: true },
						bar: false,
						baz: true,
						qux: { on: false },
						oop: true,
					},
				});
			});

			it('errors for an invalid value', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({
								// @ts-expect-error Invalid type
								plugins: true,
							}),
						],
						blueprint,
					),
				).rejects.toThrowErrorMatchingSnapshot();
			});

			it('errors for an invalid option value', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({
								// @ts-expect-error Invalid type
								plugins: {
									foo: 123,
								},
							}),
						],
						blueprint,
					),
				).rejects.toThrowErrorMatchingSnapshot();
			});
		});

		describe('booleans', () => {
			it('can overwrite', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ debug: true }), stubConfigFile({ boolean: false })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					debug: true,
					boolean: false,
				});
			});

			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});
		});

		describe('strings', () => {
			it('can overwrite', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ string: 'foo' }), stubConfigFile({ string: 'bar' })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					string: 'bar',
				});
			});

			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ string: 'foo' }), stubConfigFile({ string: undefined })],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});
		});

		describe('numbers', () => {
			it('can overwrite', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ number: 123 }), stubConfigFile({ number: 456 })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					number: 456,
				});
			});

			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ number: 999 }), stubConfigFile({ number: undefined })],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});
		});

		describe('arrays', () => {
			it('merges and flattens by default', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ stringList: ['foo', 'bar'] }),
							stubConfigFile({ stringList: [] }),
							stubConfigFile({ stringList: ['bar', 'baz'] }),
						],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					stringList: ['foo', 'bar', 'baz'],
				});
			});

			it('can overwrite using a custom handler', async () => {
				processor.addHandler('numberList', overwrite);

				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ numberList: [1, 2, 3] }), stubConfigFile({ numberList: [4, 5, 6] })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					numberList: [4, 5, 6],
				});
			});

			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ stringList: ['foo', 'bar', 'baz'] }),
							stubConfigFile({ stringList: undefined }),
						],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});
		});

		describe('objects', () => {
			it('shallow merges by default', async () => {
				await expect(
					processor.process(
						defaults,
						[
							stubConfigFile({ object: { foo: 123, nested: { a: true }, baz: false } }),
							stubConfigFile({ object: {} }),
							stubConfigFile({ object: { foo: 456, nested: { b: true }, bar: 'abc' } }),
						],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					object: { foo: 456, nested: { b: true }, bar: 'abc', baz: false },
				});
			});

			it('can overwrite using a custom handler', async () => {
				processor.addHandler('object', overwrite);

				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ object: { foo: 123 } }), stubConfigFile({ object: { bar: 456 } })],
						blueprint,
					),
				).resolves.toEqual({
					...defaults,
					object: { bar: 456 },
				});
			});

			it('can reset to default using undefined', async () => {
				await expect(
					processor.process(
						defaults,
						[stubConfigFile({ object: { bar: 456 } }), stubConfigFile({ object: undefined })],
						blueprint,
					),
				).resolves.toEqual(defaults);
			});
		});
	});
});
