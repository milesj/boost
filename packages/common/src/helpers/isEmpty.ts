import isObject from './isObject';

export default function isEmpty(value: unknown): boolean {
  return (
    !value ||
    (Array.isArray(value) && value.length === 0) ||
    (isObject(value) && Object.keys(value).length === 0) ||
    false
  );
}
