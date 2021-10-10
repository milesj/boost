/* eslint-disable no-param-reassign */

import { ArgsError } from '../ArgsError';
import { AliasMap, OptionConfigMap, OptionMap, ShortOptionName } from '../types';
import { expandShortOption } from './expandShortOption';

/**
 * Expand a group of short option names to a list of long option names.
 */
export function processShortOptionGroup(
	group: string,
	configs: OptionConfigMap,
	options: OptionMap,
	map: AliasMap,
	loose: boolean,
) {
	[...group].forEach((short) => {
		const name = expandShortOption(short as ShortOptionName, map, loose);
		const config = configs[name];

		// Loose mode, always be a flag
		if (loose && !config) {
			options[name] = true;

			// Unknown option
		} else if (!config || config.type === 'string') {
			throw new ArgsError('GROUP_UNSUPPORTED_TYPE');

			// Boolean option, flag
		} else if (config.type === 'boolean') {
			options[name] = true;

			// Number option, counter
		} else if (config.type === 'number') {
			if (config.count) {
				options[name] = Number(options[name]) + 1;
			} else {
				throw new ArgsError('GROUP_REQUIRED_COUNT');
			}
		}
	});
}
