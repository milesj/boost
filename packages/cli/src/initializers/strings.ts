import { MultipleOption } from '@boost/args';
import { createOptionInitializer } from '../metadata/createOptionInitializer';
import { PartialConfig } from '../types';

/**
 * A property initializer for declaring a command line option with multiple string values.
 */
export function strings(
	description: string,
	config?: PartialConfig<MultipleOption<string[]>>,
): string[] {
	return createOptionInitializer<MultipleOption<string[]>, string[]>({
		default: [],
		...config,
		description,
		multiple: true,
		type: 'string',
	});
}
