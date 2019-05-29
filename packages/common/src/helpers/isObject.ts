export default function isObject<T>(value: any): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
