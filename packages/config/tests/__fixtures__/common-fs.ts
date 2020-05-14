import { DirectoryJSON } from 'memfs';
import { json } from '@boost/common';

export const config = json.stringify({ debug: true });

export const pkg = json.stringify({
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
