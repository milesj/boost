import {
	copyFixtureToNodeModule,
	getFixturePath,
	getNodeModulePath,
	normalizePath,
} from '@boost/test-utils';
import { Path, PathResolver } from '../src';

describe('PathResolver', () => {
	let resolver: PathResolver;

	beforeEach(() => {
		resolver = new PathResolver();
	});

	it('throws an error if no path is resolved', async () => {
		resolver.lookupNodeModule('foo-bar');
		resolver.lookupFilePath('foo/bar');
		resolver.lookupFilePath('bar/baz');
		resolver.lookupNodeModule('bar-baz');

		const error = `Failed to resolve a path using the following lookups (in order):
  - foo-bar (node module)
  - ${normalizePath(process.cwd(), 'foo/bar')} (file system)
  - ${normalizePath(process.cwd(), 'bar/baz')} (file system)
  - bar-baz (node module)
 [CMN:PATH_RESOLVE_LOOKUPS]`;

		await expect(() => resolver.resolvePath()).rejects.toThrow(new Error(error));
	});

	it('returns first resolved node module or file path', async () => {
		const cwd = getFixturePath('module-basic');

		resolver.lookupFilePath('qux.js', cwd); // Doesnt exist
		resolver.lookupNodeModule('@boost/unknown'); // Doesnt exist
		resolver.lookupFilePath('bar.js'); // Doesnt exist at this cwd
		resolver.lookupNodeModule('@boost/common'); // Exists

		expect(resolver.getLookupPaths()).toEqual([
			new Path(cwd, 'qux.js').path(),
			'@boost/unknown',
			new Path(process.cwd(), 'bar.js').path(),
			'@boost/common',
		]);

		expect(await resolver.resolvePath()).toEqual(new Path(require.resolve('@boost/common')));
	});

	it('can utilize a custom resolver', async () => {
		resolver = new PathResolver(() => 'custom');
		resolver.lookupNodeModule('unknown'); // Exists

		expect(await resolver.resolve()).toEqual({
			originalPath: new Path('unknown'),
			resolvedPath: new Path('custom'),
			type: 'node-module',
		});
	});

	it('can utilize a custom async resolver', async () => {
		resolver = new PathResolver(() => Promise.resolve('custom'));
		resolver.lookupNodeModule('unknown'); // Exists

		expect(await resolver.resolve()).toEqual({
			originalPath: new Path('unknown'),
			resolvedPath: new Path('custom'),
			type: 'node-module',
		});
	});

	describe('file system', () => {
		it('returns first resolved path', async () => {
			const cwd = getFixturePath('module-basic');

			resolver.lookupFilePath('qux.js', cwd); // Doesnt exist
			resolver.lookupFilePath('bar.js', cwd); // Exists
			resolver.lookupFilePath('foo.js', cwd); // Exists

			expect(await resolver.resolve()).toEqual({
				originalPath: new Path('bar.js'),
				resolvedPath: new Path(cwd, 'bar.js'),
				type: 'file-system',
			});
		});

		it('supports different cwds', async () => {
			const cwd = getFixturePath('module-basic');

			resolver.lookupFilePath('qux.js', cwd); // Doesnt exist
			resolver.lookupFilePath('bar.js'); // Doesnt exist at this cwd
			resolver.lookupFilePath('foo.js', cwd); // Exists

			expect(await resolver.resolvePath()).toEqual(new Path(cwd, 'foo.js'));
		});

		it('works with completely different parent folders and file extensions', async () => {
			const src = new Path(__dirname, '../src');

			resolver.lookupFilePath('qux.js', getFixturePath('module-basic')); // Doesnt exist
			resolver.lookupFilePath('bar.js', src); // Doesnt exist
			resolver.lookupFilePath('toArray.ts', src.append('helpers')); // Exists

			expect(await resolver.resolvePath()).toEqual(new Path(src, 'helpers/toArray.ts'));
		});
	});

	describe('node modules', () => {
		it('returns first resolved module', async () => {
			resolver.lookupNodeModule('@boost/unknown'); // Doesnt exist
			resolver.lookupNodeModule('@boost/common'); // Exists
			resolver.lookupNodeModule('@boost/log'); // Exists

			expect(await resolver.resolve()).toEqual({
				originalPath: new Path('@boost/common'),
				resolvedPath: new Path(require.resolve('@boost/common')),
				type: 'node-module',
			});
		});

		it('works with sub-paths', async () => {
			const unmock = copyFixtureToNodeModule('module-basic', 'test-module-path-resolver');

			resolver.lookupNodeModule('test-module-path-resolver/qux'); // Doesnt exist
			resolver.lookupNodeModule('test-module-path-resolver/bar'); // Exists (without extension)
			resolver.lookupNodeModule('test-module-path-resolver/foo.js'); // Exists

			expect(await resolver.resolvePath()).toEqual(
				new Path(getNodeModulePath('test-module-path-resolver', 'bar.js')),
			);

			unmock();
		});
	});
});
