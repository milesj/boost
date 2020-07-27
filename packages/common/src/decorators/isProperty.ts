import isObject from '../helpers/isObject';

export default function isProperty(
  target: Function | Object,
  property?: string,
  descriptor?: unknown,
) {
  return (
    property &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((isObject<TypedPropertyDescriptor<any>>(descriptor) && descriptor.initializer) ||
      descriptor === undefined)
  );
}
