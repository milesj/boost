import mfs from 'mock-fs';
import path from 'path';
import Plugin from '../src/Plugin';
import PluginLoader from '../src/PluginLoader';

function createPluginPackage(template) {
  return {
    'node_modules/boost-plugin-foo': {
      'package.json': JSON.stringify({
        name: 'boost-plugin-foo',
        version: '0.0.0',
        main: './index.js',
      }),
      'index.js': template,
    },
  };
}

describe('PluginLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new PluginLoader('boost');
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

    it('errors if a plugin instance is exported', () => {
      mfs(createPluginPackage(() => new Plugin()));

      expect(() => {
        loader.importPlugin('foo');
      }).toThrowError('asds');
    });

    it('errors if a non-function is exported', () => {
      mfs(createPluginPackage('module.exports = 123;'));

      expect(() => {
        loader.importPlugin('foo');
      }).toThrowError('Invalid plugin class definition exported from "boost-plugin-foo".');
    });
  });
});
