/* eslint-disable sort-keys */

import { yaml } from '@boost/common';
import { DirectoryJSON, DirectoryStructure } from '@boost/test-utils';
import { pkg, rootCommon } from './common-fs';

function moduleExports(data: object): string {
  return `module.exports = ${JSON.stringify(data)};`;
}

function exportsDefault(data: object): string {
  return `exports default ${JSON.stringify(data)};`;
}

export const rootConfigJS: DirectoryJSON = {
  './.config/boost.js': moduleExports({ debug: true }),
  './package.json': pkg,
};

export const rootConfigJSON: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigJSON5: DirectoryJSON = {
  './.config/boost.json5': JSON.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigCJS: DirectoryJSON = {
  './.config/boost.cjs': moduleExports({ debug: true }),
  './package.json': JSON.stringify({ name: 'test', type: 'commonjs' }),
};

export const rootConfigMJS: DirectoryJSON = {
  './.config/boost.mjs': exportsDefault({ debug: true }),
  './package.json': JSON.stringify({ name: 'test', type: 'module' }),
};

export const rootConfigTS: DirectoryJSON = {
  './.config/boost.ts':
    'const config: { debug: boolean } = { debug: true }; export default config;',
  './package.json': JSON.stringify({ name: 'test', type: 'typescript' }),
};

export const rootConfigYAML: DirectoryJSON = {
  './.config/boost.yaml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};

export const rootConfigYML: DirectoryJSON = {
  './.config/boost.yml': yaml.stringify({ debug: true }),
  './package.json': pkg,
};

// Invalid type for testing
export const rootConfigTOML: DirectoryJSON = {
  './.config/boost.toml': '',
  './package.json': pkg,
};

export const configFileTreeAllTypes: DirectoryJSON = {
  ...rootCommon,
  './src/.boost.json': JSON.stringify({ type: 'json' }),
  './src/app/.boost.cjs': moduleExports({ type: 'cjs' }),
  './src/app/profiles/.boost.js': moduleExports({ type: 'js' }),
  './src/app/profiles/settings/.boost.yaml': yaml.stringify({ type: 'yaml' }),
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
  './src/app/.boost.json': JSON.stringify({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.tsx': '',
  './src/app/profiles/settings/.boost.json': JSON.stringify({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeJSON5: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json5': JSON.stringify({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.tsx': '',
  './src/app/profiles/settings/.boost.json5': JSON.stringify({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeCJS: DirectoryJSON = {
  ...rootCommon,
  './package.json': JSON.stringify({ name: 'boost', type: 'commonjs' }),
  './src/app/.boost.cjs': moduleExports({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.ts': '',
  './src/app/profiles/settings/.boost.cjs': moduleExports({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeMJS: DirectoryJSON = {
  ...rootCommon,
  './package.json': JSON.stringify({ name: 'boost', type: 'module' }),
  './src/app/.boost.mjs': exportsDefault({ debug: false }),
  './src/app/index.js': '',
  './src/app/profiles/Detail.ts': '',
  './src/app/profiles/settings/.boost.mjs': exportsDefault({ verbose: true }),
  './src/setup.ts': '',
};

export const configFileTreeTS: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.ts':
    'const config: { debug: boolean } = { debug: false }; export default config;',
  './src/app/index.js': '',
  './src/app/profiles/Detail.vue': '',
  './src/app/profiles/settings/.boost.ts':
    'const config: { verbose: boolean } = { verbose: true }; export default config;',
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

export const packageFileTreeMonorepo: DirectoryJSON = {
  ...rootCommon,
  './index.ts': '',
  './packages/core/package.json': JSON.stringify({ name: 'core' }),
  './packages/core/src/index.ts': '',
  './packages/core/src/deep/nested/core.ts': '',
  './packages/log/package.json': JSON.stringify({ name: 'log' }),
  './packages/log/lib/index.js': '',
  './packages/plugin/nested/example/package.json': JSON.stringify({ name: 'plugin-example' }),
  './packages/plugin/nested/example/src/index.ts': '',
  './packages/plugin/package.json': JSON.stringify({ name: 'plugin' }),
  './packages/plugin/index.js': '',
};

export const scenarioConfigsAboveRoot: DirectoryJSON = {
  // Invalid
  './.boost.json': JSON.stringify({ belowRoot: true }),
  './.config/boost.json': JSON.stringify({ belowRoot: true }),
  // Valid
  './nested/.config/boost.json': JSON.stringify({ root: true }),
  './nested/deep/.boost.json': JSON.stringify({ aboveRoot: true }),
  './nested/package.json': JSON.stringify({ name: 'boost', type: 'commonjs' }),
};

export const scenarioBranchInvalidFileName: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.toml': yaml.stringify({ invalidExt: true }),
  './src/boost.json': yaml.stringify({ missingDot: true }),
};

export const scenarioBranchMultipleTypes: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json': JSON.stringify({ type: 'json' }),
  './src/app/.boost.yaml': yaml.stringify({ type: 'yaml' }),
};

export const scenarioBranchWithEnvs: DirectoryJSON = {
  ...rootCommon,
  './src/app/.boost.json': JSON.stringify({ env: 'all' }),
  './src/app/.boost.production.json': JSON.stringify({ env: 'production' }),
  './src/app/.boost.staging.json': JSON.stringify({ env: 'staging' }),
  './src/app/.boost.test.json': JSON.stringify({ env: 'test' }),
};

export const overridesFromBranch: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': JSON.stringify({
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

export const overridesCustomSettingsName: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': JSON.stringify({
    level: 1,
    rules: [
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
  './.config/boost.json': JSON.stringify({
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
  './.config/boost.json': JSON.stringify({
    level: 1,
    overrides: [],
  }),
  './src/.boost.json': JSON.stringify({
    level: 2,
    overrides: [],
  }),
};

export const extendsFsPaths: DirectoryStructure = (root) => ({
  './.config/boost.json': JSON.stringify({
    root: true,
    extends: ['../some/relative/path/config.js', `${root}/some/absolute/path/config.yml`],
  }),
  './some/absolute/path/config.yml': yaml.stringify({ absolute: true }),
  './some/relative/path/config.js': moduleExports({ relative: true }),
  './package.json': pkg,
});

export const extendsModulePresets: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({
    root: true,
    extends: ['foo', '@scope/bar'],
  }),
  './node_modules/foo/boost.preset.js': moduleExports({ name: 'foo' }),
  './node_modules/@scope/bar/boost.preset.js': moduleExports({ name: '@scope/bar' }),
  './package.json': pkg,
};

export const extendsCustomSettingName: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({
    root: true,
    presets: ['foo', '../some/relative/path/config.js'],
  }),
  './node_modules/foo/boost.preset.js': moduleExports({ type: 'module' }),
  './some/relative/path/config.js': moduleExports({ type: 'fs' }),
  './package.json': pkg,
};

export const extendsFromOverride: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({
    root: true,
    overrides: [
      {
        include: ['*'],
        settings: {
          extends: '../some/relative/path/config.js',
          overridden: true,
        },
      },
    ],
  }),
  './some/relative/path/config.js': moduleExports({ extended: true }),
  './package.json': pkg,
};

export const invalidExtendsPath: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({
    root: true,
    extends: '123!#?',
  }),
  './package.json': pkg,
};

export const missingExtendsPath: DirectoryJSON = {
  './.config/boost.json': JSON.stringify({
    root: true,
    extends: '../some/missing/path/config.js',
  }),
  './package.json': pkg,
};

export const invalidBranchNestedExtends: DirectoryJSON = {
  ...rootCommon,
  './.config/boost.json': JSON.stringify({
    level: 1,
    extends: [],
  }),
  './src/.boost.json': JSON.stringify({
    level: 2,
    extends: [],
  }),
};
