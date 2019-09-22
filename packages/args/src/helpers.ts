import { OptionType, OptionConfig, AliasMap, ValueType, Scope, ArgumentOptions } from './types';
import { checkScopeValue } from './validate';

export function camelCase(value: string): string {
  return value.replace(/-([a-z])/giu, (match, char) => char.toUpperCase());
}

export function castValue<T extends OptionType>(
  value: unknown,
  type: T,
): T extends 'boolean' ? boolean : T extends 'number' ? number : string {
  if (type === 'boolean') {
    // @ts-ignore
    return Boolean(value);
  }

  if (type === 'number') {
    const number = Number(value);

    // @ts-ignore
    return Number.isNaN(number) ? 0 : number;
  }

  // @ts-ignore
  return String(value);
}

export function createScopeFromOption<T extends object>(
  optionName: string,
  inlineValue: string,
  optionConfigs: ArgumentOptions<T>,
  options: Partial<T>,
): Scope {
  let name = optionName;
  let negated = false;

  // Check for negated types
  if (name.slice(0, 3) === 'no-') {
    negated = true;
    name = name.slice(3);
  }

  // Convert option to camel case
  if (name.includes('-')) {
    name = camelCase(name);
  }

  const config: OptionConfig = optionConfigs[name] || { type: 'string' };
  const flag = config.type === 'boolean';
  const value = inlineValue && !flag ? castValue(inlineValue, config.type) : options[name];

  // Verify value is still accurate
  checkScopeValue(name, value, config);

  return {
    config,
    flag,
    name,
    negated,
    value,
  };
}

export function expandAliasOption(alias: string, aliasToOption: AliasMap): string {
  if (!aliasToOption[alias]) {
    throw new Error(`Unknown alias "${alias}". No associated option found.`);
  }

  return aliasToOption[alias];
}

export function expandFlagGroup(group: string, aliasToOption: AliasMap): string[] {
  const options = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const alias of group) {
    options.push(expandAliasOption(alias, aliasToOption));
  }

  return options;
}

export function getDefaultValue(config: OptionConfig): ValueType {
  let value = config.default;

  // Set and cast default value
  if (value === undefined) {
    if (config.type === 'boolean') {
      value = false;
    } else if (config.multiple) {
      value = [];
    } else {
      value = config.type === 'string' ? '' : 0;
    }
  } else if (Array.isArray(value)) {
    // @ts-ignore
    value = value.map(val => castValue(val, config.type));
  } else {
    value = castValue(value, config.type);
  }

  return value;
}

const OPTION = /^--[a-z]{1}[-a-z]*$/iu;

export function isOption(arg: string): boolean {
  return OPTION.test(arg);
}

const ALIAS_OPTION = /^-[a-z]{1}$/iu;

export function isAliasOption(arg: string): boolean {
  return ALIAS_OPTION.test(arg);
}

const FLAG_GROUP = /^-[a-z]{2,}$/iu;

export function isFlagGroup(arg: string): boolean {
  return FLAG_GROUP.test(arg);
}
