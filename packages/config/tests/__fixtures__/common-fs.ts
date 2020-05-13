import { DirectoryJSON } from 'memfs';

const config = JSON.stringify({ debug: true });

const pkg = JSON.stringify({
  boost: { verbose: true },
  name: 'boost',
  version: '0.0.0',
});

export const rootCommon: DirectoryJSON = {
  './.config/boost.json': config,
  './package.json': pkg,
};

export const rootWithoutPackageJson: DirectoryJSON = {
  './.config/boost.json': config,
};
