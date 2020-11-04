import isNodeBinary from '../../src/helpers/isNodeBinary';

describe('isNodeBinary()', () => {
  describe('unix', () => {
    it('returns true for standard case', () => {
      expect(isNodeBinary('/path/node')).toBe(true);
    });

    it('returns true for long case', () => {
      expect(isNodeBinary('/path/nodejs')).toBe(true);
    });

    it('returns true for backwards slashes', () => {
      expect(isNodeBinary('\\path\\node')).toBe(true);
    });

    it('returns false for invalid name', () => {
      expect(isNodeBinary('/path/node10')).toBe(false);
    });
  });

  describe('windows', () => {
    it('returns true for standard case', () => {
      expect(isNodeBinary('C:\\path\\node.exe')).toBe(true);
    });

    it('returns true for long case', () => {
      expect(isNodeBinary('C:\\path\\nodejs.exe')).toBe(true);
    });

    it('returns true for backwards slashes', () => {
      expect(isNodeBinary('C:/path/node.exe')).toBe(true);
    });

    it('returns false for invalid name', () => {
      expect(isNodeBinary('C:\\path\\node10.exe')).toBe(false);
    });
  });
});
