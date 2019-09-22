import { AliasMap } from '../types';
import expandShortOption from './expandShortOption';

// Expand a group of aliased flags to a list of long option names
export default function expandFlagGroup(group: string, map: AliasMap): string[] {
  const options = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const alias of group) {
    options.push(expandShortOption(alias, map));
  }

  return options;
}
