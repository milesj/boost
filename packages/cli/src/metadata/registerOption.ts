import { OptionConfig } from '@boost/args';
import getConstructor from './getConstructor';

export default function registerOption<O extends OptionConfig>(
  target: Object,
  property: string | symbol,
  config: O,
) {
  getConstructor(target).options[String(property)] = config;
}
