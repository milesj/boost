import { Invariant, OptionConfig } from '../types';

export default function verifyFlagIsOption(
  invariant: Invariant,
  name: string,
  options: { [key: string]: OptionConfig },
) {
  invariant(
    options[name] && options[name].type === 'boolean',
    'Only flags or boolean options may use flag groups.',
  );
}
