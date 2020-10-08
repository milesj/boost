module.exports = {
  coveragePathIgnorePatterns: [
    'test.ts',
    // Impossible to test
    'cli/src/LogWriter.tsx',
    'cli/src/Wrapper.tsx',
    // Not supported by Jest/Babel
    'config/src/loaders/mjs.ts',
    'config/src/loaders/supports',
    'decorators/src/helpers/isParam.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
};
