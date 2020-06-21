/* eslint-disable no-param-reassign */

import { RuntimeError } from '@boost/internal';
import { AliasMap, ShortOptionName, OptionConfigMap, OptionMap } from '../types';
import expandShortOption from './expandShortOption';

/**
 * Expand a group of short option names to a list of long option names.
 */
export default function processShortOptionGroup(
  group: string,
  configs: OptionConfigMap,
  options: OptionMap,
  map: AliasMap,
) {
  group.split('').forEach((short) => {
    const name = expandShortOption(short as ShortOptionName, map);
    const config = configs[name];

    if (!config || config.type === 'string') {
      throw new RuntimeError('args', 'AG_GROUP_UNSUPPORTED_TYPE');

      // Flag
    } else if (config.type === 'boolean') {
      options[name] = true;

      // Number counter
    } else if (config.type === 'number') {
      if (config.count) {
        options[name] = Number(options[name]) + 1;
      } else {
        throw new RuntimeError('args', 'AG_GROUP_MISSING_COUNT');
      }
    }
  });
}
