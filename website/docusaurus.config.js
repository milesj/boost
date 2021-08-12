/* eslint-disable sort-keys */

const path = require('path');

const pkgNames = [
	'args',
	'cli',
	'common',
	'config',
	'debug',
	'decorators',
	'event',
	'log',
	'pipeline',
	'plugin',
	'terminal',
	'translate',
];

const pkgs = pkgNames.map((name) => require(`../packages/${name}/package.json`));

module.exports = {
	title: 'Boost',
	tagline:
		'A collection of type-safe cross-platform packages for building robust server-side and client-side applications, packages, and tooling.',
	url: 'https://boostlib.dev',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onDuplicateRoutes: 'throw',
	favicon: 'img/favicon.svg',
	organizationName: 'milesj',
	projectName: 'boost',
	themeConfig: {
		algolia: { apiKey: 'f1f15b6694e2f453f638aac4c482df0f', indexName: 'boostlib' },
		navbar: {
			title: 'Boost',
			logo: {
				alt: 'Boost',
				src: 'img/logo.svg',
			},
			items: [
				{
					label: 'v2',
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
				packageEntryPoints: pkgNames.map((pkg) => `packages/${pkg}/src/index.ts`),
				exclude: ['**/themes/*', '**/website/*'],
				minimal: true,
				readmes: true,
			},
		],
	],
};
