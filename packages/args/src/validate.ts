import { AliasMap, OptionConfig } from './types';

export function checkAliasExists(alias: string, aliases: AliasMap) {
  if (aliases[alias]) {
    throw new Error(`Alias "${alias}" has already been defined for "${aliases[alias]}".`);
  } else if (alias.length !== 1) {
    throw new Error(`Alias "${alias}" may only be a single letter.`);
  }
}

export function checkScopeValue(optionName: string, value: unknown, config: OptionConfig) {
  if (config.multiple) {
    if (!Array.isArray(value)) {
      throw new TypeError(
        `Option "${optionName}" is enabled for multiple values, but non-array value found.`,
      );
    }

    return;
  }

  if (config.type === 'boolean' && typeof value !== 'boolean') {
    throw new TypeError(`Option "${optionName}" is set to boolean, but non-boolean value found.`);
  } else if (config.type === 'string' && typeof value !== 'string') {
    throw new TypeError(`Option "${optionName}" is set to string, but non-string value found.`);
  } else if (config.type === 'number' && typeof value !== 'number') {
    throw new TypeError(`Option "${optionName}" is set to number, but non-number value found.`);
  }
}
