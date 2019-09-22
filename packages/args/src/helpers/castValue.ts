import { OptionType } from '../types';

export default function castValue(value: unknown, type: OptionType): boolean | number | string {
  if (type === 'boolean') {
    // @ts-ignore
    return Boolean(value);
  }

  if (type === 'number') {
    const number = Number(value);

    // @ts-ignore
    return Number.isNaN(number) ? 0 : number;
  }

  // @ts-ignore
  return String(value);
}
