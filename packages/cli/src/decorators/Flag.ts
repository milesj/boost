import type { Flag as FlagConfig } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import type { PartialConfig } from '../types';

/**
 * A property decorator for declaring a command line flag (boolean value).
 */
export function Flag(description: string, config?: PartialConfig<FlagConfig>): PropertyDecorator {
	return createOptionDecorator<FlagConfig>({
		...config,
		description,
		type: 'boolean',
	});
}
