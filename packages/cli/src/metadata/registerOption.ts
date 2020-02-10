import { OptionConfig } from '@boost/args';
import getConstructor from './getConstructor';
import Command from '../Command';

export default function registerOption<O extends OptionConfig>(
  target: Object,
  property: string | symbol,
  config: O,
) {
  const ctor = getConstructor(target);

  // Without this check we would add options to the base `Command`,
  // which results in *all* sub-classes inheriting them.
  if (ctor.options === Command.options) {
    ctor.options = {};
  }

  ctor.options[String(property)] = config;
}
