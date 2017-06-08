import mfs from 'mock-fs';
import path from 'path';
import resolveModuleConfigPath from '../../src/helpers/resolveModuleConfigPath';

describe('resolveModuleConfigPath()', () => {
  beforeEach(() => {
    mfs();
  });

  afterEach(() => {
    mfs.restore();
  });

  it('returns file path with correct naming', () => {
    expect(resolveModuleConfigPath('foo', 'bar'))
      .toBe(path.join(process.cwd(), 'node_modules/bar/config/foo.preset.js'));
  });

  it('can flag as non-preset', () => {
    expect(resolveModuleConfigPath('foo', 'bar', false))
      .toBe(path.join(process.cwd(), 'node_modules/bar/config/foo.js'));
  });
});
