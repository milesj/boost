module.exports = {
  coveragePathIgnorePatterns: ['testing.ts', 'cli/src/Wrapper.tsx', 'config/src/loaders/mjs.ts'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
