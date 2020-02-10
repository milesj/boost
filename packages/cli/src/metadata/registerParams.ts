import { ParamConfig } from '@boost/args';
import getConstructor from './getConstructor';

export default function registerParams(
  target: Object,
  method: string | symbol,
  config: ParamConfig[],
) {
  if (method !== 'run') {
    throw new Error('Parameters must be defined on the `run()` method.');
  }

  getConstructor(target).params = config;
}
