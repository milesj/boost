export default function isClass(
  target: Function | Object,
  property?: string,
  descriptor?: unknown,
) {
  return typeof target === 'function' && !property && !descriptor;
}
