/* eslint-disable sort-keys */

module.exports = {
	docs: [
		'index',
		{
			type: 'category',
			label: 'Packages',
			collapsed: false,
			items: [
				'args',
				{
					type: 'category',
					label: 'CLI',
					items: ['cli', 'cli/components', 'cli/prompts'],
				},
				'common',
				'config',
				'crash',
				'debug',
				'decorators',
				'event',
				'log',
				'module',
				'pipeline',
				'plugin',
				'terminal',
				'translate',
			],
		},
		{
			type: 'link',
			label: 'Changelog',
			href: 'https://github.com/milesj/boost/blob/master/CHANGELOG.md',
		},
	],
};
