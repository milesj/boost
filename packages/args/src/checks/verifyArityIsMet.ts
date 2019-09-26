import { OptionConfig, ValueType } from '../types';

export default function verifyArityIsMet(config: OptionConfig, value: ValueType) {
  if (!config.arity || !Array.isArray(value)) {
    return;
  }

  if (value.length > 0 && value.length !== config.arity) {
    throw new Error(`Not enough arity arguments. Require ${config.arity}, found ${value.length}.`);
  }
}
