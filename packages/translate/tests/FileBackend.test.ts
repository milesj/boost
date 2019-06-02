import path from 'path';
import FileBackend from '../src/FileBackend';

describe('FileBackend', () => {
  let backend: FileBackend;

  beforeEach(() => {
    backend = new FileBackend({
      paths: [path.join(__dirname, 'res')],
    });
  });

  describe('init()', () => {
    it('sets options on class', () => {
      backend.init({}, { format: 'yaml' });

      expect(backend.options.format).toBe('yaml');
    });

    it('errors if resource path is not a directory', () => {
      expect(() => {
        backend.init(
          {},
          {
            paths: [path.join(__dirname, '../package.json')],
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('read()', () => {
    it('supports .js extension', () => {
      backend.options.format = 'js';

      expect(backend.read('en', 'type-js', () => {})).toEqual({ type: 'js' });
    });

    // it('supports .mjs extension', () => {
    //   backend.options.format = 'js';

    //   expect(backend.read('en', 'type-mjs', () => {})).toEqual({ type: 'mjs' });
    // });

    it('supports .json extension', () => {
      backend.options.format = 'json';

      expect(backend.read('en', 'type-json', () => {})).toEqual({ type: 'json' });
    });

    it('supports .json5 extension', () => {
      backend.options.format = 'json';

      expect(backend.read('en', 'type-json5', () => {})).toEqual({ type: 'json5' });
    });

    it('supports .yaml extension', () => {
      backend.options.format = 'yaml';

      expect(backend.read('en', 'type-yaml', () => {})).toEqual({ type: 'yaml' });
    });

    it('supports .yml extension', () => {
      backend.options.format = 'yaml';

      expect(backend.read('en', 'type-yaml-short', () => {})).toEqual({
        type: 'yaml',
        short: true,
      });
    });

    it('returns empty object for missing locale', () => {
      expect(backend.read('fr', 'unknown', () => {})).toEqual({});
    });

    it('returns object for defined locale', () => {
      expect(backend.read('en', 'common', () => {})).toEqual({ key: 'value' });
    });

    it('caches files after lookup', () => {
      const key = path.normalize(path.join(__dirname, 'res/en/common.json'));

      expect(backend.fileCache[key]).toBeUndefined();

      backend.read('en', 'common', () => {});

      expect(backend.fileCache[key]).toBeDefined();
      expect(backend.fileCache[key]).toEqual({ key: 'value' });
    });

    it('passes the resources to the callback', () => {
      const spy = jest.fn();

      backend.read('en', 'common', spy);

      expect(spy).toHaveBeenCalledWith(null, { common: { key: 'value' } });
    });

    it('merges objects from multiple resource paths', () => {
      backend.options.paths.push(path.join(__dirname, 'res-more'));

      expect(backend.read('en', 'common', () => {})).toEqual({ key: 'value', more: true });
    });
  });
});
