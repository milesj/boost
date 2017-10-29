import mfs from 'mock-fs';
import PluginLoader from '../src/PluginLoader';

function createPluginPackage(template) {
  return {
    'node_modules/boost-plugin-foo': {
      'index.js': template,
      'package.json': JSON.stringify({
        main: './index.js',
        name: 'boost-plugin-foo',
        version: '0.0.0',
      }),
    },
  };
}

describe('PluginLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new PluginLoader('boost', 'plugin');
    mfs();
  });

  afterEach(() => {
    mfs.restore();
  });

  describe('importPlugin()', () => {
    it('errors for missing node module', () => {
      expect(() => {
        loader.importPlugin('foo');
      }).toThrowError('Missing plugin module "boost-plugin-foo".');
    });

    it('errors if a non-function is exported', () => {
      mfs(createPluginPackage('module.exports = 123;'));

      expect(() => {
        loader.importPlugin('foo');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-foo".');
    });
  });
});
