import { Scope, ArgumentOptions, OptionConfig } from '../types';
import castValue from './castValue';

function camelCase(value: string): string {
  return value.replace(/-([a-z])/giu, (match, char) => char.toUpperCase());
}

export default function createScope<T extends object>(
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
  // checkScopeValue(name, value, config);

  return {
    config,
    flag,
    name,
    negated,
    value,
  };
}
