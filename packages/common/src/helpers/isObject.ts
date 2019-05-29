export default function isObject<T = object>(value: any): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
