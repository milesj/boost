import { SingleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with a numeric value.
 */
export function number<T extends number = number>(
	description: string,
	config?: PartialConfig<SingleOption<number>>,
): T {
	return createOptionInitializer<SingleOption<number>, T>({
		default: 0,
		...config,
		description,
		type: 'number',
	});
}
