import { OptionConfig, LongOptionName } from '../types';

export default function verifyDefaultValue(
  optionName: LongOptionName,
  value: unknown,
  config: OptionConfig,
) {
  if (config.multiple) {
    if (!Array.isArray(value)) {
      throw new TypeError(
        `Option "${optionName}" is enabled for multiple values, but non-array default value found.`,
      );
    }

    return;
  }

  if (config.type === 'boolean' && typeof value !== 'boolean') {
    throw new TypeError(
      `Option "${optionName}" is set to boolean, but non-boolean default value found.`,
    );
  }

  if (config.type === 'string' && typeof value !== 'string') {
    throw new TypeError(
      `Option "${optionName}" is set to string, but non-string default value found.`,
    );
  }

  if (config.type === 'number' && typeof value !== 'number') {
    throw new TypeError(
      `Option "${optionName}" is set to number, but non-number default value found.`,
    );
  }
}
