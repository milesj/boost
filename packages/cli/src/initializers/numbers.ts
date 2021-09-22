import { MultipleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with multiple numeric values.
 */
export function numbers(
	description: string,
	config?: PartialConfig<MultipleOption<number[]>>,
): number[] {
	return createOptionInitializer<MultipleOption<number[]>, number[]>({
		default: [],
		...config,
		description,
		multiple: true,
		type: 'number',
	});
}
