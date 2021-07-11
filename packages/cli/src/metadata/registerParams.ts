import { ParamConfig } from '@boost/args';
import { CLIError } from '../CLIError';
import { getConstructor } from './getConstructor';

export function registerParams(target: Object, method: string | symbol, config: ParamConfig[]) {
	if (method !== 'run') {
		throw new CLIError('PARAMS_RUN_ONLY');
	}

	getConstructor(target).params = config;
}
