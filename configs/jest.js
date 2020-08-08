module.exports = {
  coveragePathIgnorePatterns: [
    'testing.ts',
    // Impossible to test
    'cli/src/LogWriter.tsx',
    'cli/src/Wrapper.tsx',
    // Not supported by Jest/Babel
    'config/src/loaders/mjs.ts',
    'config/src/loaders/supports/import.ts',
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
