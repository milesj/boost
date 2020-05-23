/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Configuration from './Configuration';
import getEnv from './helpers/getEnv';
import mergeArray from './helpers/mergeArray';
import mergeExtends from './helpers/mergeExtends';
import mergeObject from './helpers/mergeObject';
import mergePlugins from './helpers/mergePlugins';
import overwrite from './helpers/overwrite';

export * from './blueprints';

export { Configuration, getEnv, mergeArray, mergeExtends, mergeObject, mergePlugins, overwrite };
