export default function isParam(target: Function | Object, property?: string, index?: unknown) {
  return property && typeof index === 'number';
}
