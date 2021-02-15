import { DirectoryJSON } from '@boost/test-utils';

export const config = JSON.stringify({ debug: true });

export const pkg = JSON.stringify({
  name: 'boost-config-example',
  version: '0.0.0',
});

export const rootCommon: DirectoryJSON = {
  './.config/boost.json': config,
  './package.json': pkg,
};

export const rootWithoutPackageJson: DirectoryJSON = {
  './.config/boost.json': config,
};
