module.exports = {
  coveragePathIgnorePatterns: ['testing.ts', 'cli/src/Wrapper.tsx', 'config/src/loaders/mjs.ts'],
  coverageThreshold: {
    global: {
      branches: 85,
      // Bump back to 95
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
