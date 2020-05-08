export default function mergeObject<T extends object>(prev: T, next: T): T {
  return { ...prev, ...next };
}
