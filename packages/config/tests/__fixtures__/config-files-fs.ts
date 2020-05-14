import { DirectoryJSON } from 'memfs';
import { json, yaml } from '@boost/common';
import { pkg } from './common-fs';

export const rootConfigJs: DirectoryJSON = {
  './.config/boost.js': 'module.exports = { debug: true };',
  './package.json': pkg,
};

export const rootConfigJson: DirectoryJSON = {
  './.config/boost.json': json.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigCjs: DirectoryJSON = {
  './.config/boost.cjs': 'module.exports = { debug: true };',
  './package.json': json.stringify({ name: 'test', type: 'commonjs' }),
};

export const rootConfigMjs: DirectoryJSON = {
  './.config/boost.mjs': 'export default { debug: true };',
  './package.json': json.stringify({ name: 'test', type: 'module' }),
};

export const rootConfigYaml: DirectoryJSON = {
  './.config/boost.yaml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigYml: DirectoryJSON = {
  './.config/boost.yml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};
