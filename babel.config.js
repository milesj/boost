module.exports = {
	babelrc: true,
	babelrcRoots: ['packages/*', 'themes/*', 'website'],
	comments: false,
	presets: [
		[
			'moon',
			{
				decorators: true,
				react: true,
			},
		],
	],
};
