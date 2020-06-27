module.exports = {
  coveragePathIgnorePatterns: [
    'testing.ts',
    'cli/src/LogWriter.tsx',
    'cli/src/Wrapper.tsx',
    'config/src/loaders/mjs.ts',
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
