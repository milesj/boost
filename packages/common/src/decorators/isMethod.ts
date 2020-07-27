import isObject from '../helpers/isObject';

export default function isMethod(
  target: Function | Object,
  property?: string | symbol,
  descriptor?: unknown,
) {
  return (
    property &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isObject<TypedPropertyDescriptor<any>>(descriptor) &&
    !descriptor.initializer
  );
}