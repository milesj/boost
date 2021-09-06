export default {
	module: '@beemo/dev',
	drivers: [
		'babel',
		'eslint',
		[
			'jest',
			{
				env: {
					NODE_ENV: 'test',
					BOOSTJS_ENV: 'test',
					COLUMNS: '80',
					LINES: '80',
				},
			},
		],
		'prettier',
		[
			'typescript',
			{
				buildFolder: 'dts',
				declarationOnly: true,
			},
		],
	],
	settings: {
		decorators: true,
		esm: true,
		node: true,
	},
};
