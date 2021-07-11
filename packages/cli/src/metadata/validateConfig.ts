import { optimal } from '@boost/common';
import { CommandStaticConfig } from '../types';
import { commandConstructorBlueprint } from './blueprints';

export function validateConfig(
	name: string,
	config: Omit<CommandStaticConfig, 'options' | 'params'>,
) {
	optimal(config, commandConstructorBlueprint, {
		name,
		unknown: true,
	});
}
