import { createInternalDebugger } from '@boost/internal';

export const debug = createInternalDebugger('plugin');

export const DEFAULT_PRIORITY = 100;

// https://github.com/npm/validate-npm-package-name
export const MODULE_PART_PATTERN = /[a-z0-9]{1}[-a-z0-9_.]*/u;

export const MODULE_NAME_PATTERN = new RegExp(
  `^(?:@(${MODULE_PART_PATTERN.source})/)?(${MODULE_PART_PATTERN.source})$`,
  'u',
);
