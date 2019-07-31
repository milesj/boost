import requireModule from '../../src/helpers/requireModule';

jest.mock('example', () => 123, { virtual: true });
jest.mock('example-es', () => ({ __esModule: true, default: 456 }), { virtual: true });

describe('requireModule()', () => {
  it('returns default exported', () => {
    expect(requireModule('example')).toBe(123);
  });

  it('returns default exported from a compiled ES module', () => {
    expect(requireModule('example-es')).toBe(456);
  });
});
