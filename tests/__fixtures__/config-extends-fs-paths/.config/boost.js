module.exports = {
  root: true,
  extends: [
    '../some/relative/path/config.js',
    `${process.cwd()}/tests/__fixtures__/config-extends-fs-paths/some/absolute/path/config.yml`,
  ],
};
