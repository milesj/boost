import { OptionConfig, ValueType } from '../types';

export default function verifyChoiceIsMet(config: OptionConfig, value: ValueType) {
  // Verify value against a list of choices
  if (Array.isArray(config.choices) && !config.choices.includes(value as 'string')) {
    throw new Error(`Invalid value, must be one of ${config.choices.join(', ')}, found ${value}.`);
  }
}
