// eslint-disable-next-line import/no-extraneous-dependencies
import { DirectoryJSON } from 'memfs';
import { rootCommon } from './common-fs';

export const ignoreFileTree: DirectoryJSON = {
  ...rootCommon,
  './.boostignore': '*.log\n*.lock',
  './src/app/components/build/.boostignore': 'esm/',
  './src/app/components/build/Button.tsx': '',
  './src/app/feature/.boostignore': '# Compiled\nlib/',
  './src/app/feature/signup/.boostignore': '# Empty',
  './src/app/feature/signup/flow/StepOne.tsx': '',
};
