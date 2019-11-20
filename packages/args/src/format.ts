import {
  Arguments,
  ArgList,
  Argv,
  FormatOptions,
  OptionConfigMap,
  OptionMap,
  PrimitiveType,
} from './types';

function formatValue(val: PrimitiveType): string {
  const value = String(val);

  return value.includes(' ') ? `"${value}"` : value;
}

export default function format(
  { command = [], options = {}, params = [], rest = [] }: Arguments<OptionMap, ArgList>,
  optionConfig: OptionConfigMap,
  { useInlineValues, useShort }: FormatOptions = {},
): Argv {
  const args: Argv = [];

  // Commands
  if (command.length > 0) {
    args.push(command.join(':'));
  }

  // Options
  Object.entries(options).forEach(([key, value]) => {
    const config = optionConfig[key];

    if (!config) {
      return;
    }

    const prefix = useShort && config.short ? '-' : '--';
    const name = useShort && config.short ? config.short : key;

    if (typeof value === 'boolean') {
      args.push(`${prefix}${value === false ? 'no-' : ''}${name}`);

      return;
    }

    const values = Array.isArray(value)
      ? (value as string[]).map(formatValue)
      : [formatValue(value)];

    if (useInlineValues) {
      values.forEach(val => {
        args.push(`${prefix}${name}=${val}`);
      });

      return;
    }

    args.push(`${prefix}${name}`, ...values);
  });

  // Params
  args.push(...params);

  // Rest
  if (rest.length > 0) {
    args.push('--', ...rest);
  }

  return [];
}
