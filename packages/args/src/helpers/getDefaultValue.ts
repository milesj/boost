import { OptionConfig, ValueType } from '../types';

export default function getDefaultValue(config: OptionConfig): ValueType {
  let value = config.default;

  if (value === undefined) {
    if (config.multiple) {
      value = [];
    } else if (config.type === 'boolean') {
      value = false;
    } else if (config.type === 'number') {
      value = 0;
    } else {
      value = '';
    }
  }

  return value;
}
