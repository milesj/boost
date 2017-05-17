import mfs from 'mock-fs';
import JSON5 from 'json5';
import ConfigLoader from '../src/ConfigLoader';

describe('ConfigLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new ConfigLoader('boost');
    mfs();
  });

  afterEach(() => {
    mfs.restore();
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
