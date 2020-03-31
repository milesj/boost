import { OptionConfig } from '@boost/args';
import { RuntimeError } from '@boost/internal';
import getConstructor from './getConstructor';
import Command from '../Command';
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
  if (ctor.options === Command.options) {
    ctor.options = {};
  }

  if (RESERVED_OPTIONS.includes(key)) {
    throw new RuntimeError('cli', 'CLI_OPTION_RESERVED', [key]);
  }

  ctor.options[key] = config;
}
