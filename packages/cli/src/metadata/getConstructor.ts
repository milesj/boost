import { CommandStaticConfig } from '../types';

export function getConstructor(target: Object): CommandStaticConfig {
	return target.constructor as unknown as CommandStaticConfig;
}
