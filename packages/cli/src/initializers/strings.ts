import { MultipleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with multiple string values.
 */
export function strings<T extends string[] = string[]>(
	description: string,
	config?: PartialConfig<MultipleOption<string[]>>,
): T {
	return createOptionInitializer<MultipleOption<string[]>, T>({
		default: [],
		...config,
		description,
		multiple: true,
		type: 'string',
	});
}
