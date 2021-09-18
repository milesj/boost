import { optimal } from '@boost/common/optimal';
import { CommandStaticConfig } from '../types';
import { commandConstructorBlueprint } from './blueprints';

export function validateConfig(
	name: string,
	config: Omit<CommandStaticConfig, 'options' | 'params'>,
) {
	optimal(commandConstructorBlueprint, {
		name,
		unknown: true,
	}).validate(config);
}
