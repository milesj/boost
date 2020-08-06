/* eslint-disable sort-keys */

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
        // {
        //   href: 'https://www.npmjs.com/package/@boost/core',
        //   label: `v${pkg.version}`,
        //   position: 'left',
        // },
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'browser',
          label: 'Browser',
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
      copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with Docusaurus.`,
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
