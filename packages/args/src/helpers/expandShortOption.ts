import ArgsError from '../ArgsError';
import { AliasMap, ShortOptionName, LongOptionName } from '../types';

/**
 * Expand a short option name to a long option name.
 */
export default function expandShortOption(short: ShortOptionName, map: AliasMap): LongOptionName {
  if (!map[short]) {
    throw new ArgsError('SHORT_UNKNOWN', [short]);
  }

  return map[short];
}
