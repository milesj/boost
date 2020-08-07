/* eslint-disable sort-keys */

const pkgs = [
  'args',
  'cli',
  'common',
  'config',
  'debug',
  'event',
  'log',
  'pipeline',
  'plugin',
  'terminal',
  'translate',
  // eslint-disable-next-line
].map((name) => require(`@boost/${name}/package.json`));

module.exports = {
  title: 'Boost',
  tagline:
    'A collection of type-safe cross-platform packages for building robust Node.js based applications, packages, and tools.',
  url: 'https://boostlib.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.svg',
  organizationName: 'milesj',
  projectName: 'boost',
  themeConfig: {
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
          homePageId: 'index',
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
};
