import { SingleOption } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

/**
 * A property decorator for declaring a command line option with a numeric value.
 */
export function Number(
	description: string,
	config?: PartialConfig<SingleOption<number>>,
): PropertyDecorator {
	return createOptionDecorator<SingleOption<number>>({
		...config,
		description,
		type: 'number',
	});
}
