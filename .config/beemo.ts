export default {
  module: '@milesj/build-tools',
  drivers: [
    'babel',
    'eslint',
    [
      'jest',
      {
        env: {
          NODE_ENV: 'test',
          BOOSTJS_ENV: 'test',
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
    node: true,
    react: true,
  },
  // prettier: {
  //   ignore: ['CHANGELOG.md'],
  // },
};
