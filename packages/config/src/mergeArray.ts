export default function mergeArray<T extends unknown[]>(prev: T, next: T): T {
  return Array.from(new Set([...prev, ...next])) as T;
}
