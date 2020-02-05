import { PrimitiveType } from '@boost/args';

export default function formatValue(value: PrimitiveType): string {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    default:
      return String(value);
  }
}
