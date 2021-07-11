import { Flag as FlagConfig } from '@boost/args';
import createOptionDecorator from '../metadata/createOptionDecorator';
import { PartialConfig } from '../types';

export default function Flag(
	description: string,
	config?: PartialConfig<FlagConfig>,
): PropertyDecorator {
	return createOptionDecorator<FlagConfig>({
		...config,
		description,
		type: 'boolean',
	});
}
