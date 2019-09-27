import { OptionConfigMap, OptionMap, OptionConfig, ValueType } from '../types';
import ValidationError from '../ValidationError';

export default function mapOptionConfigs(
  configs: OptionConfigMap,
  options: OptionMap,
  cb: (data: { key: string; config: OptionConfig; value: ValueType }) => void,
): Error[] {
  const errors: Error[] = [];

  Object.keys(configs).forEach(key => {
    try {
      cb({
        config: configs[key],
        key,
        value: options[key],
      });
    } catch (error) {
      errors.push(new ValidationError(error.message, key));
    }
  });

  return errors;
}
