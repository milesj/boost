import { OptionConfigMap, OptionMap, OptionConfig, ValueType, ParserOptions } from '../types';
import ValidationError from '../ValidationError';
import { ParseOptions } from 'querystring';

export default function mapConfigs<T extends object>(
  configs: ParserOptions<T>,
  options: OptionMap,
  {
    onCommand,
    onOption,
  }: {
    onCommand?: (command: string) => void;
    onOption?: (data: { key: string; config: OptionConfig; value: ValueType }) => void;
  },
): Error[] {
  const errors: Error[] = [];

  if (onCommand && configs.commands) {
    configs.commands.forEach(command => {
      try {
        onCommand(command);
      } catch (error) {
        errors.push(new ValidationError(error.message));
      }
    });
  }

  if (onOption) {
    Object.keys(configs.options).forEach(key => {
      try {
        onOption({
          config: configs.options[key as keyof T],
          key,
          value: options[key],
        });
      } catch (error) {
        errors.push(new ValidationError(error.message, key));
      }
    });
  }

  return errors;
}
