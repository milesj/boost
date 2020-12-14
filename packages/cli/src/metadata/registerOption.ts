import { OptionConfig } from '@boost/args';
import CLIError from '../CLIError';
import getConstructor from './getConstructor';
import globalOptions from './globalOptions';
import { RESERVED_OPTIONS } from '../constants';

export default function registerOption<O extends OptionConfig>(
  target: Object,
  property: string | symbol,
  config: O,
) {
  const ctor = getConstructor(target);
  const key = String(property);

  // Without this check we would mutate the base `Command`,
  // resulting in *all* sub-classes inheriting them.
  if (ctor.options === globalOptions) {
    ctor.options = {};
  }

  if (RESERVED_OPTIONS.includes(key)) {
    throw new CLIError('OPTION_RESERVED', [key]);
  }

  ctor.options[key] = config;
}
