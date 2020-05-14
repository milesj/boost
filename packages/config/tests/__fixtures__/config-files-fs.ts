import { DirectoryJSON } from 'memfs';
import { json, yaml } from '@boost/common';
import { pkg, rootCommon } from './common-fs';

function moduleExports(data: object): string {
  return `module.exports = ${json.stringify(data)};`;
}

function exportsDefault(data: object): string {
  return `exports default ${json.stringify(data)};`;
}

export const rootConfigJS: DirectoryJSON = {
  './.config/boost.js': moduleExports({ debug: true }),
  './package.json': pkg,
};

export const rootConfigJSON: DirectoryJSON = {
  './.config/boost.json': json.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigCJS: DirectoryJSON = {
  './.config/boost.cjs': moduleExports({ debug: true }),
  './package.json': json.stringify({ name: 'test', type: 'commonjs' }),
};

export const rootConfigMJS: DirectoryJSON = {
  './.config/boost.mjs': exportsDefault({ debug: true }),
  './package.json': json.stringify({ name: 'test', type: 'module' }),
};

export const rootConfigYAML: DirectoryJSON = {
  './.config/boost.yaml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigYML: DirectoryJSON = {
  './.config/boost.yml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};

export const configFileTreeJS: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.js': moduleExports({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.vue': '',
  './src/app/profiles/settings/.boost.js': moduleExports({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeJSON: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json': json.stringify({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.tsx': '',
  './src/app/profiles/settings/.boost.json': json.stringify({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeCJS: DirectoryJSON = {
  ...rootCommon,
  './package.json': json.stringify({ name: 'boost', type: 'commonjs' }),
  './src/app/.boost.cjs': moduleExports({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.ts': '',
  './src/app/profiles/settings/.boost.cjs': moduleExports({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeMJS: DirectoryJSON = {
  ...rootCommon,
  './package.json': json.stringify({ name: 'boost', type: 'module' }),
  './src/app/.boost.mjs': exportsDefault({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.ts': '',
  './src/app/profiles/settings/.boost.mjs': exportsDefault({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeYAML: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.yaml': yaml.stringify({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.tsx': '',
  './src/app/profiles/settings/.boost.yaml': yaml.stringify({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeYML: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.yml': yaml.stringify({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.tsx': '',
  './src/app/profiles/settings/.boost.yml': yaml.stringify({ verbose: true }),
  './src/setup.ts': '',
};

export const scenarioConfigsAboveRoot: DirectoryJSON = {
  // Invalid
  './.boost.json': json.stringify({ belowRoot: true }),
  './.config/boost.json': json.stringify({ belowRoot: true }),
  // Valid
  './nested/.config/boost.json': json.stringify({ root: true }),
  './nested/deep/.boost.json': json.stringify({ aboveRoot: true }),
  './nested/package.json': json.stringify({ name: 'boost', type: 'commonjs' }),
};

export const scenarioBranchInvalidFileName: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.toml': yaml.stringify({ invalidExt: true }),
  './src/boost.json': yaml.stringify({ missingDot: true }),
};

export const scenarioBranchMultipleTypes: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json': json.stringify({ type: 'json' }),
  './src/app/.boost.yaml': yaml.stringify({ type: 'yaml' }),
};

export const scenarioBranchWithEnvs: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json': json.stringify({ env: 'all' }),
  './src/app/.boost.production.json': json.stringify({ env: 'production' }),
  './src/app/.boost.staging.json': json.stringify({ env: 'staging' }),
  './src/app/.boost.test.json': json.stringify({ env: 'test' }),
};

export const overridesFromBranch: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': json.stringify({
    level: 1,
    overrides: [
      {
        include: '*.ts',
        settings: {
          level: 2,
        },
      },
    ],
  }),
  './src/bar/doesnt-match.ts': '',
  './src/foo/does-match.ts': '',
  './src/foo/doesnt-match.js': '',
};

export const overridesFromBranchWithExcludes: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': json.stringify({
    level: 1,
    overrides: [
      {
        exclude: 'baz.ts',
        include: ['ba*'],
        settings: {
          level: 2,
        },
      },
    ],
  }),
  './src/baa.ts': '',
  './src/bar.ts': '',
  './src/baz.ts': '',
};

export const invalidBranchNestedOverrides: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': json.stringify({
    level: 1,
    overrides: [],
  }),
  './src/.boost.json': json.stringify({
    level: 2,
    overrides: [],
  }),
};
