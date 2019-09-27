import { AliasMap, ShortOptionName } from '../types';

export default function verifyUniqueShortName(short: ShortOptionName, map: AliasMap) {
  if (map[short]) {
    throw new Error(`Short option "${short}" has already been defined for "${map[short]}".`);
  }

  if (short.length !== 1) {
    throw new Error(`Short option "${short}" may only be a single letter.`);
  }
}
