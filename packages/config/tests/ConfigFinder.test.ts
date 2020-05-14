import { vol } from 'memfs';
import Cache from '../src/Cache';
import ConfigFinder from '../src/ConfigFinder';
import { rootWithoutPackageJson } from './__fixtures__/common-fs';
import {
  rootConfigJs,
  rootConfigCjs,
  // rootConfigMjs,
  rootConfigJson,
  rootConfigYaml,
  rootConfigYml,
} from './__fixtures__/config-files-fs';
import { stubPath } from './helpers';

jest.mock('fs', () => require.requireActual('memfs').vol);

describe('ConfigFinder', () => {
  let cache: Cache;
  let finder: ConfigFinder<{ debug: boolean }>;

  beforeEach(() => {
    cache = new Cache();
    finder = new ConfigFinder({ name: 'boost' }, cache);

    vol.reset();
  });

  describe('loadFromRoot()', () => {
    it('returns `.js` config file from root', async () => {
      vol.fromJSON(rootConfigJs, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath('/test/.config/boost.js'),
          root: true,
        },
      ]);
    });

    it('returns `.cjs` config file from root', async () => {
      vol.fromJSON(rootConfigCjs, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath('/test/.config/boost.cjs'),
          root: true,
        },
      ]);
    });

    it('returns `.json` config file from root', async () => {
      vol.fromJSON(rootConfigJson, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath('/test/.config/boost.json'),
          root: true,
        },
      ]);
    });

    it('returns `.yaml` config file from root', async () => {
      vol.fromJSON(rootConfigYaml, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath('/test/.config/boost.yaml'),
          root: true,
        },
      ]);
    });

    it('returns `.yml` config file from root', async () => {
      vol.fromJSON(rootConfigYml, '/test');

      const files = await finder.loadFromRoot('/test');

      expect(files).toEqual([
        {
          config: { debug: true },
          path: stubPath('/test/.config/boost.yml'),
          root: true,
        },
      ]);
    });

    it('errors if not root folder', async () => {
      vol.fromJSON({ './src': '' }, '/test');

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
