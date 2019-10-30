import { RuntimeError } from '@boost/internal';
import { AliasMap, ShortOptionName, LongOptionName } from '../types';

/**
 * Expand a short option name to a long option name.
 */
export default function expandShortOption(short: ShortOptionName, map: AliasMap): LongOptionName {
  if (!map[short]) {
    throw new RuntimeError('args', 'AG_SHORT_UNKNOWN', [short]);
  }

  return map[short];
}
