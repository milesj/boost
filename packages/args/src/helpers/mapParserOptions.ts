import { OptionMap, OptionConfig, ValueType, ParserOptions, PositionalConfig } from '../types';

export default function mapParserOptions<O extends object, P extends unknown[]>(
  configs: ParserOptions<O, P>,
  options: OptionMap,
  positionals: ValueType[],
  {
    onCommand,
    onOption,
    onPositional,
  }: {
    onCommand?: (command: string) => void;
    onOption?: (config: OptionConfig, value: ValueType, name: string) => void;
    onPositional?: (config: PositionalConfig, value: ValueType, index: number) => void;
  },
) {
  if (onCommand && Array.isArray(configs.commands)) {
    configs.commands.forEach(command => {
      onCommand(command);
    });
  }

  if (onOption) {
    Object.keys(configs.options).forEach(name => {
      onOption(configs.options[name as keyof O], options[name], name);
    });
  }

  if (onPositional && configs.positionals) {
    configs.positionals.forEach((config, i) => {
      onPositional(config, positionals[i], i);
    });
  }
}
