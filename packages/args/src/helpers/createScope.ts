import { Scope, OptionConfig, ValueMap, LongOptionName } from '../types';
import updateScopeValue from './updateScopeValue';

function camelCase(value: string): string {
  return value.replace(/-([a-z0-9])/giu, (match, char) => char.toUpperCase());
}

export default function createScope(
  optionName: LongOptionName,
  inlineValue: string | undefined,
  optionConfigs: { [key: string]: OptionConfig },
  options: ValueMap,
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

  // Create scope
  const config = optionConfigs[name] || { type: 'string' };
  const flag = config.type === 'boolean';
  const scope = {
    config,
    flag,
    name,
    negated,
    value: undefined,
  };

  // When capturing multiples, we need to persist the array
  // so we can append. Avoid using the default array though.
  if (config.multiple) {
    // @ts-ignore I know types don't match, yolo
    scope.value = options[name] === config.default ? [] : options[name];
  }

  // Update scope value if an inline value exists
  if (inlineValue !== undefined && !flag) {
    updateScopeValue(scope, inlineValue);
    // TODO error if inline values set for flags
  }

  // Verify value is still accurate
  // checkScopeValue(name, value, config);

  return scope;
}
