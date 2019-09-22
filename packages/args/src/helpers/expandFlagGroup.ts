import { Mapping, LongOptionName, ShortOptionName } from '../types';
import expandShortOption from './expandShortOption';

// Expand a group of short flags to a list of long option names
export default function expandFlagGroup(group: string, map: Mapping): LongOptionName[] {
  return group.split('').map(short => expandShortOption(short as ShortOptionName, map));
}
