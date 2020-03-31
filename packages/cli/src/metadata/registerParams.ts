import { ParamConfig } from '@boost/args';
import { RuntimeError } from '@boost/internal';
import getConstructor from './getConstructor';

export default function registerParams(
  target: Object,
  method: string | symbol,
  config: ParamConfig[],
) {
  if (method !== 'run') {
    throw new RuntimeError('cli', 'CLI_PARAMS_RUN_ONLY');
  }

  getConstructor(target).params = config;
}
