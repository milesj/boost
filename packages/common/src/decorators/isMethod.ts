import isObject from '../helpers/isObject';

export default function isMethod(
  target: Function | Object,
  property?: string | symbol,
  descriptor?: unknown,
): boolean {
  return Boolean(
    property &&
      isObject<TypedPropertyDescriptor<unknown>>(descriptor) &&
      !descriptor.initializer &&
      ('value' in descriptor || 'get' in descriptor),
  );
}
