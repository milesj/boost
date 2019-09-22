import { OptionConfig, ValueType } from '../types';
import castValue from './castValue';

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
  } else if (Array.isArray(value)) {
    // @ts-ignore
    value = value.map(val => castValue(val, config.type));
  } else {
    value = castValue(value, config.type);
  }

  return value;
}
