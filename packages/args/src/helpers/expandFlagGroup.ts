import { AliasMap, LongOptionName, ShortOptionName } from '../types';
import expandShortOption from './expandShortOption';

/**
 * Expand a group of short flags to a list of long option names.
 */
export default function expandFlagGroup(group: string, map: AliasMap): LongOptionName[] {
  return group.split('').map(short => expandShortOption(short as ShortOptionName, map));
}
