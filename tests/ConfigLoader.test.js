import mfs from 'mock-fs';
import JSON5 from 'json5';
import ConfigLoader from '../src/ConfigLoader';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';

describe('ConfigLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new ConfigLoader('boost');
    mfs();
  });

  afterEach(() => {
    mfs.restore();
  });

  describe('loadConfig()', () => {
    it('errors if package.json has not been loaded', () => {
      expect(() => {
        loader.loadConfig();
      }).toThrowError('Cannot load configuration as "package.json" has not been loaded.');
    });

    describe('from package.json', () => {
      it('errors if not an object', () => {
        loader.package = { boost: [] };

        expect(() => {
          loader.loadConfig();
        }).toThrowError('Invalid configuration. Must be a plain object.');
      });

      it('supports an object under the same name as the app', () => {
        loader.package = {
          boost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports a string and converts it to `extends`', () => {
        loader.package = {
          boost: 'path/to/extend',
        };

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ extends: 'path/to/extend' }));
      });

      it('merges with default config', () => {
        loader.package = {
          boost: { foo: 'bar' },
        };

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });
    });

    describe('from config folder', () => {
      beforeEach(() => {
        loader.package = { name: 'foo' };

        mfs({
          'package.json': JSON.stringify({ name: 'foo' }),
        });
      });

      it('errors if no files found', () => {
        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Local configuration file could not be found. One of "config/boost.json" or "config/boost.js" must exist relative to the project root.',
        );
      });

      it('errors if too many files are found', () => {
        mfs({
          'config/boost.js': '',
          'config/boost.json': '',
        });

        expect(() => {
          loader.loadConfig();
        }).toThrowError(
          'Multiple "boost" configuration files found. Only 1 may exist.',
        );
      });

      it('supports .json files', () => {
        mfs({
          'config/boost.json': JSON.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .json5 files', () => {
        mfs({
          'config/boost.json5': JSON5.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('supports .js files', () => {
        mfs({
          'config/boost.js': 'module.exports = { foo: \'bar\' };',
        });

        expect(loader.loadConfig()).toEqual(expect.objectContaining({ foo: 'bar' }));
      });

      it('merges with default config', () => {
        mfs({
          'config/boost.json': JSON.stringify({ foo: 'bar' }),
        });

        expect(loader.loadConfig()).toEqual({
          ...DEFAULT_TOOL_CONFIG,
          foo: 'bar',
        });
      });
    });
  });

  describe('loadPackageJSON()', () => {
    it('errors if no package.json exists in current working directory', () => {
      expect(() => {
        loader.loadPackageJSON();
      }).toThrowError(
        'Local "package.json" could not be found. Please run the command in your project\'s root.',
      );
    });

    it('merges with default values if package.json is empty', () => {
      mfs({
        'package.json': JSON.stringify({}),
      });

      expect(loader.loadPackageJSON()).toEqual({
        name: '',
        version: '',
      });
    });

    it('parses package.json and merges values', () => {
      mfs({
        'package.json': JSON.stringify({ name: 'foo' }),
      });

      expect(loader.loadPackageJSON()).toEqual({
        name: 'foo',
        version: '',
      });
    });
  });

  describe('parseFile()', () => {
    it('errors for an unsupported file format', () => {
      mfs({
        'foo.txt': 'foo',
      });

      expect(() => {
        loader.parseFile('foo.txt');
      }).toThrowError('Unsupported configuration file format "foo.txt".');
    });

    it('errors if an object is not returned', () => {
      mfs({
        'bool.json': JSON.stringify(true),
        'number.json': JSON.stringify(123),
        'string.json': JSON.stringify('foo'),
        'array.json': JSON.stringify([]),
      });

      expect(() => {
        loader.parseFile('bool.json');
      }).toThrowError('Invalid configuration file "bool.json". Must return an object.');

      expect(() => {
        loader.parseFile('number.json');
      }).toThrowError('Invalid configuration file "number.json". Must return an object.');

      expect(() => {
        loader.parseFile('string.json');
      }).toThrowError('Invalid configuration file "string.json". Must return an object.');

      expect(() => {
        loader.parseFile('array.json');
      }).toThrowError('Invalid configuration file "array.json". Must return an object.');
    });

    it('parses .json files', () => {
      mfs({
        'foo.json': JSON.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json')).toEqual({ name: 'foo' });
    });

    it('parses .json files in JSON5 format', () => {
      mfs({
        'foo.json': JSON5.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json')).toEqual({ name: 'foo' });
    });

    it('parses .json5 files', () => {
      mfs({
        'foo.json5': JSON5.stringify({ name: 'foo' }),
      });

      expect(loader.parseFile('foo.json5')).toEqual({ name: 'foo' });
    });

    it('parses .js files', () => {
      mfs({
        'foo.js': 'module.exports = { name: \'foo\' };',
      });

      expect(loader.parseFile('foo.js')).toEqual({ name: 'foo' });
    });
  });
});
