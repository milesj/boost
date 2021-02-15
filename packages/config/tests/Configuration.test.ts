import { Blueprint, Predicates } from '@boost/common';
import { createTempFolderStructureFromJSON } from '@boost/test-utils';
import { Configuration, createExtendsPredicate, mergeExtends } from '../src';
import { ExtendsSetting, ExtType } from '../src/types';
import { configFileTreeAllTypes, rootConfigJSON } from './__fixtures__/config-files-fs';
import { ignoreFileTree } from './__fixtures__/ignore-files-fs';
import { stubPath } from './helpers';

interface BoostConfig {
  debug: boolean;
  extends: ExtendsSetting;
  type: ExtType;
}

class BoostConfiguration extends Configuration<BoostConfig> {
  blueprint({ bool, string }: Predicates): Blueprint<BoostConfig> {
    return {
      debug: bool(),
      extends: createExtendsPredicate(),
      type: string('js').oneOf<ExtType>(['js', 'cjs', 'mjs', 'json', 'yaml', 'yml']),
    };
  }

  bootstrap() {
    this.configureFinder({
      extendsSetting: 'extends',
    });

    this.configureProcessor({
      defaultWhenUndefined: false,
    });

    this.addProcessHandler('extends', mergeExtends);
  }
}

describe('Configuration', () => {
  let config: BoostConfiguration;

  beforeEach(() => {
    config = new BoostConfiguration('boost');
  });

  describe('clearCache()', () => {
    it('clears file and finder cache on cache engine', () => {
      // @ts-expect-error
      const spy1 = jest.spyOn(config.cache, 'clearFileCache');
      // @ts-expect-error
      const spy2 = jest.spyOn(config.cache, 'clearFinderCache');

      config.clearCache();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('clearFileCache()', () => {
    it('clears file cache on cache engine', () => {
      // @ts-expect-error
      const spy = jest.spyOn(config.cache, 'clearFileCache');

      config.clearFileCache();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clearFinderCache()', () => {
    it('clears finder cache on cache engine', () => {
      // @ts-expect-error
      const spy = jest.spyOn(config.cache, 'clearFinderCache');

      config.clearFinderCache();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('loadConfigFromBranchToRoot()', () => {
    it('loads and processes all configs', async () => {
      const loadSpy = jest.fn((c) => c);
      const processSpy = jest.fn();
      const tempRoot = createTempFolderStructureFromJSON(configFileTreeAllTypes);

      config.onLoadedConfig.listen(loadSpy);
      config.onProcessedConfig.listen(processSpy);

      const result = await config.loadConfigFromBranchToRoot(
        `${tempRoot}/src/app/profiles/settings`,
      );
      const expected = {
        config: {
          debug: true,
          extends: [],
          type: 'yaml',
        },
        files: [
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
          {
            config: { type: 'json' },
            path: stubPath(`${tempRoot}/src/.boost.json`),
            source: 'branch',
          },
          {
            config: { type: 'cjs' },
            path: stubPath(`${tempRoot}/src/app/.boost.cjs`),
            source: 'branch',
          },
          {
            config: { type: 'js' },
            path: stubPath(`${tempRoot}/src/app/profiles/.boost.js`),
            source: 'branch',
          },
          {
            config: { type: 'yaml' },
            path: stubPath(`${tempRoot}/src/app/profiles/settings/.boost.yaml`),
            source: 'branch',
          },
        ],
      };

      expect(result).toEqual(expected);
      expect(loadSpy).toHaveBeenCalledWith(expected.files);
      expect(loadSpy).toHaveReturnedWith(expected.files);
      expect(processSpy).toHaveBeenCalledWith(expected.config);
    });
  });

  describe('loadConfigFromRoot()', () => {
    it('loads and processes root config', async () => {
      const loadSpy = jest.fn((c) => c);
      const processSpy = jest.fn();
      const tempRoot = createTempFolderStructureFromJSON(rootConfigJSON);

      config.onLoadedConfig.listen(loadSpy);
      config.onProcessedConfig.listen(processSpy);

      const result = await config.loadConfigFromRoot(tempRoot);
      const expected = {
        config: {
          debug: true,
          extends: [],
          type: 'js',
        },
        files: [
          {
            config: { debug: true },
            path: stubPath(`${tempRoot}/.config/boost.json`),
            source: 'root',
          },
        ],
      };

      expect(result).toEqual(expected);
      expect(loadSpy).toHaveBeenCalledWith(expected.files);
      expect(loadSpy).toHaveReturnedWith(expected.files);
      expect(processSpy).toHaveBeenCalledWith(expected.config);
    });
  });

  describe('loadIgnoreFromBranchToRoot()', () => {
    it('loads all ignores', async () => {
      const spy = jest.fn((c) => c);
      const tempRoot = createTempFolderStructureFromJSON(ignoreFileTree);

      config.onLoadedIgnore.listen(spy);

      const result = await config.loadIgnoreFromBranchToRoot(
        `${tempRoot}/src/app/feature/signup/flow`,
      );
      const expected = [
        {
          ignore: ['*.log', '*.lock'],
          path: stubPath(`${tempRoot}/.boostignore`),
          source: 'root',
        },
        {
          ignore: ['lib/'],
          path: stubPath(`${tempRoot}/src/app/feature/.boostignore`),
          source: 'branch',
        },
        {
          ignore: [],
          path: stubPath(`${tempRoot}/src/app/feature/signup/.boostignore`),
          source: 'branch',
        },
      ];

      expect(result).toEqual(expected);
      expect(spy).toHaveBeenCalledWith(expected);
      expect(spy).toHaveReturnedWith(expected);
    });
  });

  describe('loadIgnoreFromRoot()', () => {
    it('loads root ignore', async () => {
      const spy = jest.fn((c) => c);
      const tempRoot = createTempFolderStructureFromJSON(ignoreFileTree);

      config.onLoadedIgnore.listen(spy);

      const result = await config.loadIgnoreFromRoot(tempRoot);
      const expected = [
        {
          ignore: ['*.log', '*.lock'],
          path: stubPath(`${tempRoot}/.boostignore`),
          source: 'root',
        },
      ];

      expect(result).toEqual(expected);
      expect(spy).toHaveBeenCalledWith(expected);
      expect(spy).toHaveReturnedWith(expected);
    });
  });
});
