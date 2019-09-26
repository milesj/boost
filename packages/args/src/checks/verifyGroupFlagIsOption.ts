import { OptionConfig } from '../types';

export default function verifyGroupFlagIsOption(
  name: string,
  options: { [key: string]: OptionConfig },
) {
  if (!options[name] || options[name].type !== 'boolean') {
    throw new Error('Only boolean options may use flag groups.');
  }
}
