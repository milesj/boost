import { SingleOption } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

export function String(
	description: string,
	config?: PartialConfig<SingleOption<string>>,
): PropertyDecorator {
	return createOptionDecorator<SingleOption<string>>({
		...config,
		description,
		type: 'string',
	});
}
