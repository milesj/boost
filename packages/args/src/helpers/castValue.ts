import { ValueType } from '../types';

export default function castValue(
  value: unknown,
  type?: 'boolean' | 'number' | 'string',
): ValueType {
  if (Array.isArray(value)) {
    return value.map(val => castValue(val, type)) as string[];
  }

  switch (type) {
    case 'boolean':
      return Boolean(value);

    case 'number': {
      const number = Number(value);

      return Number.isNaN(number) ? 0 : number;
    }

    default:
      return String(value);
  }
}
