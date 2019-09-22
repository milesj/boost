import { Mapping } from '../types';
import expandShortOption from './expandShortOption';

// Expand a group of short flags to a list of long option names
export default function expandFlagGroup(group: string, map: Mapping): string[] {
  const options = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const short of group) {
    options.push(expandShortOption(short, map));
  }

  return options;
}
