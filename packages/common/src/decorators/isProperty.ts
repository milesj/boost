import isObject from '../helpers/isObject';

export default function isProperty(
  target: Function | Object,
  property?: string | symbol,
  descriptor?: unknown,
): boolean {
  return Boolean(
    property &&
      ((isObject<TypedPropertyDescriptor<unknown>>(descriptor) && descriptor.initializer) ||
        descriptor === undefined),
  );
}
