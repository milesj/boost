/* eslint-disable no-param-reassign */

import ArgsError from '../ArgsError';
import expandShortOption from './expandShortOption';
import { AliasMap, ShortOptionName, OptionConfigMap, OptionMap } from '../types';

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
      throw new ArgsError('GROUP_UNSUPPORTED_TYPE');

      // Flag
    } else if (config.type === 'boolean') {
      options[name] = true;

      // Number counter
    } else if (config.type === 'number') {
      if (config.count) {
        options[name] = Number(options[name]) + 1;
      } else {
        throw new ArgsError('GROUP_REQUIRED_COUNT');
      }
    }
  });
}
