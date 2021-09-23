import { SingleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with a string value.
 */
export function string<T extends string = string>(
	description: string,
	config?: PartialConfig<SingleOption<string>>,
): T {
	return createOptionInitializer<SingleOption<string>, T>({
		default: '',
		...config,
		description,
		type: 'string',
	});
}
