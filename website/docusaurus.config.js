/* eslint-disable sort-keys */

const path = require('path');

const pkgs = [
	'args',
	'cli',
	'common',
	'config',
	'debug',
	'decorators',
	'event',
	'log',
	'module',
	'pipeline',
	'plugin',
	'terminal',
	'translate',
].map((name) => require(`../packages/${name}/package.json`));

module.exports = {
	title: 'Boost',
	tagline:
		'A collection of type-safe cross-platform packages for building robust server-side and client-side applications, packages, and tooling.',
	url: 'https://boostlib.dev',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onDuplicateRoutes: 'throw',
	favicon: 'img/favicon.svg',
	organizationName: 'milesj',
	projectName: 'boost',
	themeConfig: {
		algolia: {
			apiKey: 'af3749c00577f28165d836ebc0f27144',
			appId: '7VOI7UGWV0',
			indexName: 'boostlib',
		},
		navbar: {
			title: 'Boost',
			logo: {
				alt: 'Boost',
				src: 'img/logo.svg',
			},
			items: [
				{
					label: `v${pkgs[0].version[0]}`,
					position: 'left',
					items: pkgs.map((pkg) => ({
						label: `v${pkg.version} · ${pkg.name.split('/')[1]}`,
						href: `https://www.npmjs.com/package/${pkg.name}`,
					})),
				},
				{
					to: 'docs',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left',
				},
				{
					to: 'api',
					label: 'API',
					position: 'left',
				},
				{
					href: 'https://github.com/milesj/boost',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [],
			copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Icon by <a href="https://thenounproject.com/search/?q=boost&i=1420345">Chameleon Design</a>.`,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/milesj/boost/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					editUrl: 'https://github.com/milesj/boost/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
	plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				packages: [
					...[
						'args',
						'config',
						'decorators',
						'event',
						'pipeline',
						'plugin',
						'terminal',
						'translate',
					].map((pkg) => `packages/${pkg}`),
					{
						path: 'packages/cli',
						entry: {
							index: 'src/index.ts',
							react: { path: 'src/react.ts', label: 'Components & hooks' },
							test: { path: 'src/test.ts', label: 'Test utilities' },
						},
					},
					{
						path: 'packages/common',
						entry: {
							index: 'src/index.ts',
							test: { path: 'src/test.ts', label: 'Test utilities' },
							optimal: { path: 'src/optimal.ts', label: 'Optimal' },
						},
					},
					{
						path: 'packages/debug',
						entry: {
							index: 'src/index.ts',
							test: { path: 'src/test.ts', label: 'Test utilities' },
						},
					},
					{
						path: 'packages/log',
						entry: {
							index: 'src/index.ts',
							test: { path: 'src/test.ts', label: 'Test utilities' },
						},
					},
					{
						path: 'packages/module',
						entry: {
							index: 'src/index.ts',
							loader: { path: 'src/hooks', label: 'Node.js hooks' },
						},
					},
				],
				minimal: true,
				readmes: true,
				debug: false,
				tsconfigName: 'tsconfig.docs.json',
			},
		],
	],
};
