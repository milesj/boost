import { Invariant } from '../types';

export default function verifyNoFlagInlineValue(invariant: Invariant, inlineValue?: string) {
  invariant(inlineValue === undefined, 'Flags and flag groups may not use inline values.');
}
