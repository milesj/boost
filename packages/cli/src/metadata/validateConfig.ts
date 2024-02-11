import { optimal } from '@boost/common/optimal';
import type { CommandStaticConfig } from '../types';
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
