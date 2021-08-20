import glob from 'fast-glob';
import { PackageGraph } from '../src/PackageGraph';
import { Path } from '../src/Path';
import { PackageStructure } from '../src/types';

function getBeemoPackages() {
	const pkgs: Record<string, PackageStructure> = {};

	// Globs must be forward slashes on Windows to work correctly
	glob
		.sync('*/package.json', {
			absolute: true,
			cwd: new Path(__dirname, '../../../node_modules/@beemo').path(),
		})
		.forEach((pkgPath) => {
			const pkg = require(pkgPath);
			pkgs[pkg.name] = pkg;
		});

	return pkgs;
}

describe('PackageGraph', () => {
	it('graphs dependencies correctly', () => {
		const pkgs = getBeemoPackages();
		const graph = new PackageGraph(Object.values(pkgs));

		expect(graph.resolveList()).toEqual([
			pkgs['@beemo/core'],
			pkgs['@beemo/config-constants'],
			pkgs['@beemo/driver-babel'],
			pkgs['@beemo/driver-eslint'],
			pkgs['@beemo/driver-jest'],
			pkgs['@beemo/driver-prettier'],
			pkgs['@beemo/driver-typescript'],
			pkgs['@beemo/cli'],
			pkgs['@beemo/config-babel'],
			pkgs['@beemo/config-eslint'],
			pkgs['@beemo/config-jest'],
			pkgs['@beemo/config-prettier'],
			pkgs['@beemo/config-typescript'],
			pkgs['@beemo/dev'],
		]);

		expect(graph.resolveBatchList()).toEqual([
			[pkgs['@beemo/core'], pkgs['@beemo/config-constants']],
			[
				pkgs['@beemo/driver-babel'],
				pkgs['@beemo/driver-eslint'],
				pkgs['@beemo/driver-jest'],
				pkgs['@beemo/driver-prettier'],
				pkgs['@beemo/driver-typescript'],
				pkgs['@beemo/cli'],
			],
			[
				pkgs['@beemo/config-babel'],
				pkgs['@beemo/config-eslint'],
				pkgs['@beemo/config-jest'],
				pkgs['@beemo/config-prettier'],
				pkgs['@beemo/config-typescript'],
			],
			[pkgs['@beemo/dev']],
		]);

		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: pkgs['@beemo/core'],
					nodes: [
						{
							package: pkgs['@beemo/driver-babel'],
							nodes: [
								{
									package: pkgs['@beemo/config-babel'],
									nodes: [
										{
											package: pkgs['@beemo/dev'],
										},
									],
								},
							],
						},
						{
							package: pkgs['@beemo/driver-eslint'],
							nodes: [
								{
									package: pkgs['@beemo/config-eslint'],
								},
							],
						},
						{
							package: pkgs['@beemo/driver-jest'],
							nodes: [
								{
									package: pkgs['@beemo/config-jest'],
								},
							],
						},
						{
							package: pkgs['@beemo/driver-prettier'],
							nodes: [
								{
									package: pkgs['@beemo/config-prettier'],
								},
							],
						},
						{
							package: pkgs['@beemo/driver-typescript'],
							nodes: [
								{
									package: pkgs['@beemo/config-typescript'],
								},
							],
						},
						{
							package: pkgs['@beemo/cli'],
						},
					],
				},
				{
					package: pkgs['@beemo/config-constants'],
				},
			],
		});
	});

	it('returns an empty array when no packages are defined', () => {
		const graph = new PackageGraph();

		expect(graph.resolveList()).toEqual([]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [],
		});
	});

	it('places all nodes at the root if they do not relate to each other', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0' },
			{ name: 'baz', version: '0.0.0' },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'bar', version: '0.0.0' },
			{ name: 'baz', version: '0.0.0' },
			{ name: 'foo', version: '0.0.0' },
		]);
		expect(graph.resolveBatchList()).toEqual([
			[
				{ name: 'bar', version: '0.0.0' },
				{ name: 'baz', version: '0.0.0' },
				{ name: 'foo', version: '0.0.0' },
			],
		]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'bar', version: '0.0.0' },
				},
				{
					package: { name: 'baz', version: '0.0.0' },
				},
				{
					package: { name: 'foo', version: '0.0.0' },
				},
			],
		});
	});

	it('maps dependencies between 2 packages', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
		]);
		expect(graph.resolveBatchList()).toEqual([
			[{ name: 'foo', version: '0.0.0' }],
			[{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } }],
		]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'foo', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
						},
					],
				},
			],
		});
	});

	it('maps dependencies between 2 packages (reverse order + peer deps)', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0', peerDependencies: { bar: '0.0.0' } },
			{ name: 'bar', version: '0.0.0' },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'bar', version: '0.0.0' },
			{ name: 'foo', version: '0.0.0', peerDependencies: { bar: '0.0.0' } },
		]);
		expect(graph.resolveBatchList()).toEqual([
			[{ name: 'bar', version: '0.0.0' }],
			[{ name: 'foo', version: '0.0.0', peerDependencies: { bar: '0.0.0' } }],
		]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'bar', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'foo', version: '0.0.0', peerDependencies: { bar: '0.0.0' } },
						},
					],
				},
			],
		});
	});

	it('maps dependencies between 3 packages', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
			{ name: 'bar', version: '0.0.0' },
			{ name: 'baz', version: '0.0.0' },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'baz', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0' },
			{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
		]);
		expect(graph.resolveBatchList()).toEqual([
			[
				{ name: 'baz', version: '0.0.0' },
				{ name: 'bar', version: '0.0.0' },
			],
			[{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } }],
		]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'baz', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
						},
					],
				},
				{
					package: { name: 'bar', version: '0.0.0' },
				},
			],
		});
	});

	it('maps 3 layers deep', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } },
			{ name: 'bar', version: '0.0.0', dependencies: { baz: '0.0.0' } },
			{ name: 'baz', version: '0.0.0' },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'baz', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0', dependencies: { baz: '0.0.0' } },
			{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[{ name: 'baz', version: '0.0.0' }],
			[{ name: 'bar', version: '0.0.0', dependencies: { baz: '0.0.0' } }],
			[{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } }],
		]);

		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'baz', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'bar', version: '0.0.0', dependencies: { baz: '0.0.0' } },
							nodes: [
								{ package: { name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } } },
							],
						},
					],
				},
			],
		});
	});

	it('package with 2 dependencies', () => {
		const graph = new PackageGraph([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
			{ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
			{ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[{ name: 'foo', version: '0.0.0' }],
			[
				{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
				{ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } },
			],
		]);
	});

	it('sorts each depth by most dependend on', () => {
		const graph = new PackageGraph([
			{ name: 'a', version: '0.0.0' },
			{ name: 'b', version: '0.0.0' },
			{ name: 'c', version: '0.0.0' },
			{ name: 'd', version: '0.0.0', dependencies: { b: '0.0.0' } },
			{ name: 'e', version: '0.0.0', dependencies: { i: '0.0.0' } },
			{ name: 'f', version: '0.0.0', peerDependencies: { b: '0.0.0' } },
			{ name: 'g', version: '0.0.0', dependencies: { a: '0.0.0' } },
			{ name: 'h', version: '0.0.0', dependencies: { b: '0.0.0' } },
			{ name: 'i', version: '0.0.0', dependencies: { k: '0.0.0' } },
			{ name: 'j', version: '0.0.0', peerDependencies: { c: '0.0.0' } },
			{ name: 'k', version: '0.0.0', dependencies: { f: '0.0.0' } },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'b', version: '0.0.0' },
			{ name: 'a', version: '0.0.0' },
			{ name: 'c', version: '0.0.0' },
			{ name: 'f', version: '0.0.0', peerDependencies: { b: '0.0.0' } },
			{ name: 'd', version: '0.0.0', dependencies: { b: '0.0.0' } },
			{ name: 'g', version: '0.0.0', dependencies: { a: '0.0.0' } },
			{ name: 'h', version: '0.0.0', dependencies: { b: '0.0.0' } },
			{ name: 'j', version: '0.0.0', peerDependencies: { c: '0.0.0' } },
			{ name: 'k', version: '0.0.0', dependencies: { f: '0.0.0' } },
			{ name: 'i', version: '0.0.0', dependencies: { k: '0.0.0' } },
			{ name: 'e', version: '0.0.0', dependencies: { i: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[
				{ name: 'b', version: '0.0.0' },
				{ name: 'a', version: '0.0.0' },
				{ name: 'c', version: '0.0.0' },
			],
			[
				{ name: 'f', version: '0.0.0', peerDependencies: { b: '0.0.0' } },
				{ name: 'd', version: '0.0.0', dependencies: { b: '0.0.0' } },
				{ name: 'g', version: '0.0.0', dependencies: { a: '0.0.0' } },
				{ name: 'h', version: '0.0.0', dependencies: { b: '0.0.0' } },
				{ name: 'j', version: '0.0.0', peerDependencies: { c: '0.0.0' } },
			],
			[{ name: 'k', version: '0.0.0', dependencies: { f: '0.0.0' } }],
			[{ name: 'i', version: '0.0.0', dependencies: { k: '0.0.0' } }],
			[{ name: 'e', version: '0.0.0', dependencies: { i: '0.0.0' } }],
		]);
		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'b', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'f', version: '0.0.0', peerDependencies: { b: '0.0.0' } },
							nodes: [
								{
									package: { name: 'k', version: '0.0.0', dependencies: { f: '0.0.0' } },
									nodes: [
										{
											package: { name: 'i', version: '0.0.0', dependencies: { k: '0.0.0' } },
											nodes: [
												{
													package: { name: 'e', version: '0.0.0', dependencies: { i: '0.0.0' } },
												},
											],
										},
									],
								},
							],
						},
						{
							package: { name: 'd', version: '0.0.0', dependencies: { b: '0.0.0' } },
						},
						{
							package: { name: 'h', version: '0.0.0', dependencies: { b: '0.0.0' } },
						},
					],
				},
				{
					package: { name: 'a', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'g', version: '0.0.0', dependencies: { a: '0.0.0' } },
						},
					],
				},
				{
					package: { name: 'c', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'j', version: '0.0.0', peerDependencies: { c: '0.0.0' } },
						},
					],
				},
			],
		});
	});

	it('orders correctly regardless of folder alpha sorting', () => {
		const graph = new PackageGraph([
			{ name: 'core', version: '0.0.0', dependencies: { icons: '0.0.0' } },
			{ name: 'icons', version: '0.0.0' },
			{ name: 'helpers', version: '0.0.0', dependencies: { core: '0.0.0', utils: '0.0.0' } },
			{ name: 'forms', version: '0.0.0', dependencies: { core: '0.0.0' } },
			{ name: 'utils', version: '0.0.0', dependencies: { core: '0.0.0' } },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'icons', version: '0.0.0' },
			{ name: 'core', version: '0.0.0', dependencies: { icons: '0.0.0' } },
			{ name: 'utils', version: '0.0.0', dependencies: { core: '0.0.0' } },
			{ name: 'forms', version: '0.0.0', dependencies: { core: '0.0.0' } },
			{ name: 'helpers', version: '0.0.0', dependencies: { core: '0.0.0', utils: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[{ name: 'icons', version: '0.0.0' }],
			[{ name: 'core', version: '0.0.0', dependencies: { icons: '0.0.0' } }],
			[
				{ name: 'utils', version: '0.0.0', dependencies: { core: '0.0.0' } },
				{ name: 'forms', version: '0.0.0', dependencies: { core: '0.0.0' } },
			],
			[{ name: 'helpers', version: '0.0.0', dependencies: { core: '0.0.0', utils: '0.0.0' } }],
		]);

		expect(graph.resolveTree()).toEqual({
			root: true,
			nodes: [
				{
					package: { name: 'icons', version: '0.0.0' },
					nodes: [
						{
							package: { name: 'core', version: '0.0.0', dependencies: { icons: '0.0.0' } },
							nodes: [
								{
									package: { name: 'utils', version: '0.0.0', dependencies: { core: '0.0.0' } },
									nodes: [
										{
											package: {
												name: 'helpers',
												version: '0.0.0',
												dependencies: { core: '0.0.0', utils: '0.0.0' },
											},
										},
									],
								},
								{
									package: { name: 'forms', version: '0.0.0', dependencies: { core: '0.0.0' } },
								},
							],
						},
					],
				},
			],
		});
	});

	it('orders correctly with complex dependencies', () => {
		const graph = new PackageGraph([
			{ name: 'stats', version: '0.0.0', dependencies: {} },
			{
				name: 'service-client',
				version: '0.0.0',
				dependencies: { stats: '0.0.0', 'http-client': '0.0.0' },
			},
			{
				name: 'auth-client',
				version: '0.0.0',
				dependencies: { stats: '0.0.0', 'http-client': '0.0.0' },
			},
			{ name: 'config', version: '0.0.0', dependencies: {} },
			{ name: 'feature-flags', version: '0.0.0', dependencies: { config: '0.0.0' } },
			{
				name: 'framework',
				version: '0.0.0',
				dependencies: { stats: '0.0.0', 'auth-client': '0.0.0', 'feature-flags': '0.0.0' },
			},
			{ name: 'http-client', version: '0.0.0', dependencies: { stats: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[
				{ name: 'stats', version: '0.0.0', dependencies: {} },
				{ name: 'config', version: '0.0.0', dependencies: {} },
			],
			[
				{ name: 'http-client', version: '0.0.0', dependencies: { stats: '0.0.0' } },
				{ name: 'feature-flags', version: '0.0.0', dependencies: { config: '0.0.0' } },
			],
			[
				{
					name: 'auth-client',
					version: '0.0.0',
					dependencies: { stats: '0.0.0', 'http-client': '0.0.0' },
				},
				{
					name: 'service-client',
					version: '0.0.0',
					dependencies: { stats: '0.0.0', 'http-client': '0.0.0' },
				},
			],
			[
				{
					name: 'framework',
					version: '0.0.0',
					dependencies: { stats: '0.0.0', 'auth-client': '0.0.0', 'feature-flags': '0.0.0' },
				},
			],
		]);
	});

	it('resets the graph when a package is added after resolution', () => {
		const graph = new PackageGraph<PackageStructure>([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0' },
		]);

		expect(graph.resolveList()).toEqual([
			{ name: 'bar', version: '0.0.0' },
			{ name: 'foo', version: '0.0.0' },
		]);

		graph.addPackage({ name: 'qux', version: '0.0.0', dependencies: { baz: '0.0.0' } });
		graph.addPackage({ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } });

		expect(graph.resolveList()).toEqual([
			{ name: 'foo', version: '0.0.0' },
			{ name: 'bar', version: '0.0.0' },
			{ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } },
			{ name: 'qux', version: '0.0.0', dependencies: { baz: '0.0.0' } },
		]);

		expect(graph.resolveBatchList()).toEqual([
			[
				{ name: 'foo', version: '0.0.0' },
				{ name: 'bar', version: '0.0.0' },
			],
			[{ name: 'baz', version: '0.0.0', dependencies: { foo: '0.0.0' } }],
			[{ name: 'qux', version: '0.0.0', dependencies: { baz: '0.0.0' } }],
		]);
	});

	describe('circular', () => {
		describe('list', () => {
			it('errors when no root nodes found', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0', dependencies: { bar: '0.0.0' } },
				]);

				expect(() => {
					graph.resolveList();
				}).toThrow('Circular dependency detected: foo -> bar -> baz -> foo');
			});

			it('errors when only some of the deps are a cycle', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0' },
				]);

				expect(() => {
					graph.resolveList();
				}).toThrow('Circular dependency detected: foo -> bar -> foo');
			});
		});

		describe('tree', () => {
			it('errors when no root nodes found', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0', dependencies: { bar: '0.0.0' } },
				]);

				expect(() => {
					graph.resolveTree();
				}).toThrow('Circular dependency detected: foo -> bar -> baz -> foo');
			});

			it('errors when only some of the deps are a cycle', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0' },
				]);

				expect(() => {
					graph.resolveTree();
				}).toThrow('Circular dependency detected: foo -> bar -> foo');
			});
		});

		describe('batchList', () => {
			it('errors when no root nodes found', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { baz: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0', dependencies: { bar: '0.0.0' } },
				]);

				expect(() => {
					graph.resolveBatchList();
				}).toThrow('Circular dependency detected: foo -> bar -> baz -> foo');
			});

			it('errors when only some of the deps are a cycle', () => {
				const graph = new PackageGraph([
					{ name: 'foo', version: '0.0.0', dependencies: { bar: '0.0.0' } },
					{ name: 'bar', version: '0.0.0', dependencies: { foo: '0.0.0' } },
					{ name: 'baz', version: '0.0.0' },
				]);

				expect(() => {
					graph.resolveBatchList();
				}).toThrow('Circular dependency detected: foo -> bar -> foo');
			});
		});
	});
});
