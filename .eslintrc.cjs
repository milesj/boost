module.exports = {
	root: true,
	extends: ['moon', 'moon/node'],
	parserOptions: {
		project: 'tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
	},
	rules: {
		'node/no-unpublished-import': 'off',
		// Doesnt work with `package.json` exports
		'import/no-unresolved': 'off',
		// Not ESM yet
		'unicorn/prefer-module': 'off',
	},
};
