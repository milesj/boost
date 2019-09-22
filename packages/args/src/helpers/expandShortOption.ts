import { Mapping, ShortOptionName, LongOptionName } from '../types';

// Expand a short option name to a long option name
export default function expandShortOption(short: ShortOptionName, map: Mapping): LongOptionName {
  if (!map[short]) {
    throw new Error(`Unknown short option "-${short}". No associated long option found.`);
  }

  return map[short];
}
