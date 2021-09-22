import { SingleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with a string value.
 */
export function string(description: string, config?: PartialConfig<SingleOption<string>>): string {
	return createOptionInitializer<SingleOption<string>, string>({
		default: '',
		...config,
		description,
		type: 'string',
	});
}
