import { Flag as FlagConfig } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line flag (boolean value).
 */
export function flag(description: string, config?: PartialConfig<FlagConfig>): boolean {
	return createOptionInitializer<FlagConfig, boolean>({
		default: false,
		...config,
		description,
		type: 'boolean',
	});
}
