import { MultipleOption } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

/**
 * A property decorator for declaring a command line option with multiple string values.
 */
export function Strings(
	description: string,
	config?: PartialConfig<MultipleOption<string[]>>,
): PropertyDecorator {
	return createOptionDecorator<MultipleOption<string[]>>({
		...config,
		default: [],
		description,
		multiple: true,
		type: 'string',
	});
}
