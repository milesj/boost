import { CommandStaticConfig } from '../types';

export default function getConstructor(target: Object): CommandStaticConfig {
	return target.constructor as unknown as CommandStaticConfig;
}
