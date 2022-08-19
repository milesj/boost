module.exports = {
	preset: 'jest-preset-moon',
	coveragePathIgnorePatterns: [
		'__fixtures__',
		'src/test.ts',
		// Annoying to test
		'cli/src/hooks',
		// Impossible to test
		'common/src/helpers/requireTypedModule.ts',
		'cli/src/middleware/checkNodeRequirement.ts',
		'cli/src/LogWriter.tsx',
		'cli/src/Wrapper.tsx',
		// Not supported by Jest/Babel
		'config/src/loaders/mjs.ts',
		'config/src/loaders/ts.ts',
		'config/src/loaders/supports',
		'decorators/src/helpers/isParam.ts',
		// Ignore these packages
		'internal/src',
		'module',
		'terminal/src',
		'test-utils/src',
		'website/src',
	],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 99,
			lines: 99,
			statements: 99,
		},
	},
	testPathIgnorePatterns: ['src/test.ts'],
};
