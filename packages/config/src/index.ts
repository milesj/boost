/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import type { ConfigErrorCode } from './ConfigError';
import ConfigError from './ConfigError';
import Configuration from './Configuration';
import getEnv from './helpers/getEnv';
import mergeArray from './helpers/mergeArray';
import mergeExtends from './helpers/mergeExtends';
import mergeObject from './helpers/mergeObject';
import mergePlugins from './helpers/mergePlugins';
import overwrite from './helpers/overwrite';

export * from './predicates';
export * from './types';

export {
  ConfigError,
  Configuration,
  getEnv,
  mergeArray,
  mergeExtends,
  mergeObject,
  mergePlugins,
  overwrite,
};

export type { ConfigErrorCode };
