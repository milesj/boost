import { MultipleOption } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

/**
 * A property decorator for declaring a command line option with multiple numeric values.
 */
export function Numbers(
	description: string,
	config?: PartialConfig<MultipleOption<number[]>>,
): PropertyDecorator {
	return createOptionDecorator<MultipleOption<number[]>>({
		...config,
		default: [],
		description,
		multiple: true,
		type: 'number',
	});
}
