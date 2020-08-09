import fs from 'fs';
import path from 'path';
import { MIN_IE_VERSION, MIN_NODE_VERSION } from '@milesj/build-tools/lib/constants';
import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Keep in sync with build tool config
function createBabelConfig(targets) {
  return babel({
    babelHelpers: 'bundled',
    babelrc: false,
    configFile: false,
    exclude: 'node_modules/**',
    extensions,
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-export-default-from',
      ['babel-plugin-transform-dev', { evaluate: false }],
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
          shippedProposals: true,
          targets,
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
  });
}

// Define packages (order is imporant)
const nodePackages = [
  'common',
  'args',
  'cli',
  'config',
  'debug',
  'log',
  'pipeline',
  'plugin',
  'terminal',
  'test-utils',
  'translate',
];

const webPackages = ['internal', 'decorators', 'event'];

// Generate targets (web should be first)
const targets = [];

webPackages.forEach((pkg) => {
  targets.push({
    input: `packages/${pkg}/src/index.ts`,
    output: [
      {
        file: `packages/${pkg}/lib/index.js`,
        format: 'cjs',
      },
      {
        file: `packages/${pkg}/esm/index.js`,
        format: 'esm',
      },
    ],
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      resolve({ extensions }),
      createBabelConfig({ ie: MIN_IE_VERSION }),
    ],
  });
});

nodePackages.forEach((pkg) => {
  targets.push({
    input: `packages/${pkg}/src/index.ts`,
    output: [
      {
        file: `packages/${pkg}/lib/index.js`,
        format: 'cjs',
      },
    ],
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      resolve({ extensions }),
      createBabelConfig({ node: MIN_NODE_VERSION }),
    ],
  });
});

// Support test utils
const testingExternals = {
  cli: ['ink', 'react'],
};

[...webPackages, ...nodePackages].forEach((pkg) => {
  const input = `packages/${pkg}/src/testing.ts`;

  if (!fs.existsSync(path.join(__dirname, input))) {
    return;
  }

  targets.push({
    external: ['./index', /^@boost\//u, ...(testingExternals[pkg] || [])],
    input,
    output: [
      {
        file: `packages/${pkg}/lib/testing.js`,
        format: 'cjs',
      },
    ],
    plugins: [resolve({ extensions }), createBabelConfig({ node: MIN_NODE_VERSION })],
  });
});

export default targets;
