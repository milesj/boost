import { OptionConfig } from '@boost/args';
import CLIError from '../CLIError';
import { RESERVED_OPTIONS } from '../constants';
import getConstructor from './getConstructor';

export default function registerOption<O extends OptionConfig>(
  target: Object,
  property: string | symbol,
  config: O,
) {
  const ctor = getConstructor(target);
  const key = String(property);

  // Without this check we would mutate the prototype chain,
  // resulting in *all* sub-classes inheriting the same options.
  if (!ctor.hasRegisteredOptions) {
    ctor.options = {};
    ctor.hasRegisteredOptions = true;
  }

  if (RESERVED_OPTIONS.includes(key)) {
    throw new CLIError('OPTION_RESERVED', [key]);
  }

  ctor.options[key] = config;
}
