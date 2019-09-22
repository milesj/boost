import { Mapping } from '../types';

// Expand a short option name to a long option name
export default function expandShortOption(short: string, map: Mapping): string {
  if (!map[short]) {
    throw new Error(`Unknown short option "-${short}". No associated long option found.`);
  }

  return map[short];
}
