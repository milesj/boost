import { normalize, resolve } from 'path';
import Path from '../src/Path';

describe('Path', () => {
  describe('constructor()', () => {
    it('joins multiple parts', () => {
      const path = new Path('/foo/bar', '../baz', 'file.js');

      expect(path.toString()).toBe(normalize('/foo/baz/file.js'));
    });
  });

  describe('append()', () => {
    it('appends to existing path', () => {
      const path = new Path('/foo/bar', '../baz');

      expect(path.toString()).toBe(normalize('/foo/baz'));

      path.append('qux/foo');
      path.append('..', './current');

      expect(path.toString()).toBe(normalize('/foo/baz/qux/current'));
    });
  });

  describe('ext()', () => {
    it('returns extension for file', () => {
      const path = new Path('/foo/bar.js');

      expect(path.ext()).toBe('.js');
    });

    it('returns extension without period for file', () => {
      const path = new Path('/foo/bar.js');

      expect(path.ext(true)).toBe('js');
    });

    it('returns extension for folder', () => {
      const path = new Path('/foo/bar');

      expect(path.ext()).toBe('');
    });
  });

  describe('isAbsolute()', () => {
    it('returns true if absolute', () => {
      const path = new Path('/foo/bar');

      expect(path.isAbsolute()).toBe(true);
    });

    it('returns false if relative', () => {
      const path = new Path('foo/bar');

      expect(path.isAbsolute()).toBe(false);
    });
  });

  describe('name()', () => {
    it('returns file name', () => {
      const path = new Path('/foo/bar.js');

      expect(path.name()).toBe('bar.js');
    });

    it('returns file name without extension', () => {
      const path = new Path('/foo/bar.js');

      expect(path.name(true)).toBe('bar');
    });

    it('returns folder name', () => {
      const path = new Path('/foo/bar');

      expect(path.name()).toBe('bar');
    });
  });

  describe('parent()', () => {
    it('returns new instance when no path', () => {
      const path = new Path('');

      expect(path.parent()).toEqual(new Path(''));
    });

    it('returns parent folder as a new instance', () => {
      const path = new Path('/foo/bar/baz.js');

      expect(path.parent()).toEqual(new Path('/foo/bar'));
    });

    it('returns parent folder name when a folder', () => {
      const path = new Path('/foo/bar/baz');

      expect(path.parent()).toEqual(new Path('/foo/bar'));
    });
  });

  describe('resolve()', () => {
    it('returns a new instance with path resolved to cwd', () => {
      const path = new Path('foo/bar/baz');

      expect(path.resolve()).toEqual(new Path(resolve('foo/bar/baz')));
    });
  });
});
