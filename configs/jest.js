module.exports = {
  coveragePathIgnorePatterns: ['testing.ts', 'cli/src/Wrapper.tsx'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
