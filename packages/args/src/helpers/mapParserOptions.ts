import { OptionMap, OptionConfig, ValueType, ParserOptions } from '../types';

export default function mapParserOptions<T extends object>(
  configs: ParserOptions<T>,
  options: OptionMap,
  {
    onCommand,
    onOption,
  }: {
    onCommand?: (command: string) => void;
    onOption?: (config: OptionConfig, value: ValueType, name: string) => void;
  },
) {
  if (onCommand && configs.commands) {
    configs.commands.forEach(command => {
      onCommand(command);
    });
  }

  if (onOption) {
    Object.keys(configs.options).forEach(name => {
      onOption(configs.options[name as keyof T], options[name], name);
    });
  }
}
