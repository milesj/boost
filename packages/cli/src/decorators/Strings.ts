import { MultipleOption } from '@boost/args';
import { createOptionDecorator } from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

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
