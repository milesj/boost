import { vol } from 'memfs';
import Cache from '../src/Cache';
import IgnoreFinder from '../src/IgnoreFinder';
import { rootWithoutPackageJson } from './__fixtures__/common-fs';
import { ignoreFileTree } from './__fixtures__/ignore-files-fs';
import { stubPath } from './helpers';

jest.mock('fs', () => jest.requireActual('memfs').vol);

describe('IgnoreFinder', () => {
  let cache: Cache;
  let finder: IgnoreFinder;

  beforeEach(() => {
    cache = new Cache();
    finder = new IgnoreFinder({ name: 'boost' }, cache);

    vol.reset();
  });

  it('errors if name is not in camel case', () => {
    expect(() => {
      finder = new IgnoreFinder({ name: 'Boosty Boost' }, cache);
    }).toThrow(
      'Invalid IgnoreFinder field "name". String must be in camel case. (pattern "^[a-z][0-9A-Za-z]+$")',
    );
  });

  it('caches root, file, and directory information', async () => {
    vol.fromJSON(ignoreFileTree, '/test');

    await finder.loadFromBranchToRoot('/test/src/app/feature/signup/flow');

    expect(cache.rootDir).toEqual(stubPath('/test'));
    expect(cache.configDir).toEqual(stubPath('/test/.config'));
    expect(cache.pkgPath).toEqual(stubPath('/test/package.json'));
    expect(cache.dirFilesCache).toEqual({});
    expect(cache.fileContentCache).toEqual({
      [stubPath('/test/.boostignore').path()]: {
        content: '*.log\n*.lock',
        exists: true,
        mtime: expect.any(Number),
      },
      [stubPath('/test/src/app/feature/.boostignore').path()]: {
        content: '# Compiled\nlib/',
        exists: true,
        mtime: expect.any(Number),
      },
      [stubPath('/test/src/app/feature/signup/.boostignore').path()]: {
        content: '# Empty',
        exists: true,
        mtime: expect.any(Number),
      },
    });
  });

  describe('loadFromBranchToRoot()', () => {
    it('returns all ignore files from a target file', async () => {
      vol.fromJSON(ignoreFileTree, '/test');

      const files = await finder.loadFromBranchToRoot('/test/src/app/components/build/Button.tsx');

      expect(files).toEqual([
        {
          ignore: ['*.log', '*.lock'],
          path: stubPath('/test/.boostignore'),
          source: 'root',
        },
        {
          ignore: ['esm/'],
          path: stubPath('/test/src/app/components/build/.boostignore'),
          source: 'branch',
        },
      ]);
    });

    it('returns all ignore files from a target folder', async () => {
      vol.fromJSON(ignoreFileTree, '/test');

      const files = await finder.loadFromBranchToRoot('/test/src/app/feature/signup/flow/');

      expect(files).toEqual([
        {
          ignore: ['*.log', '*.lock'],
          path: stubPath('/test/.boostignore'),
          source: 'root',
        },
        {
          ignore: ['lib/'],
          path: stubPath('/test/src/app/feature/.boostignore'),
          source: 'branch',
        },
        {
          ignore: [],
          path: stubPath('/test/src/app/feature/signup/.boostignore'),
          source: 'branch',
        },
      ]);
    });
  });

  describe('loadFromRoot()', () => {
    it('returns ignore file from root folder', async () => {
      vol.fromJSON(ignoreFileTree, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          ignore: ['*.log', '*.lock'],
          path: stubPath('/test/.boostignore'),
          source: 'root',
        },
      ]);
    });

    it('errors if not root folder', async () => {
      vol.fromJSON(ignoreFileTree, '/test');

      await expect(finder.loadFromRoot('/test/src')).rejects.toThrow(
        'Invalid configuration root. Requires a `.config` folder and `package.json`.',
      );
    });

    it('errors if root folder is missing a `package.json`', async () => {
      vol.fromJSON(rootWithoutPackageJson, '/test');

      await expect(finder.loadFromRoot('/test')).rejects.toThrow(
        'Config folder `.config` found without a relative `package.json`. Both must be located in the project root.',
      );
    });
  });
});
