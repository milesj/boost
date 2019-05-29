export default function isObject<T extends object>(value: T): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
