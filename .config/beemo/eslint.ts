export default {
	rules: {
		// Broken on Windows
		'import/named': 'off',
		// Not ESM yet
		'unicorn/prefer-module': 'off',
		// Doesnt support `exports` well
		'import/no-unresolved': 'off',
	},
};
