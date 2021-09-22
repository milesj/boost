import { MultipleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with multiple numeric values.
 */
export function numbers<T extends number[] = number[]>(
	description: string,
	config?: PartialConfig<MultipleOption<number[]>>,
): T {
	return createOptionInitializer<MultipleOption<number[]>, T>({
		default: [],
		...config,
		description,
		multiple: true,
		type: 'number',
	});
}
