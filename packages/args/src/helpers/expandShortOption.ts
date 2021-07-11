import { ArgsError } from '../ArgsError';
import { AliasMap, LongOptionName, ShortOptionName } from '../types';

/**
 * Expand a short option name to a long option name.
 */
export function expandShortOption(
	short: ShortOptionName,
	map: AliasMap,
	loose: boolean,
): LongOptionName {
	if (!map[short]) {
		if (loose) {
			return short;
		}

		throw new ArgsError('SHORT_UNKNOWN', [short]);
	}

	return map[short];
}
