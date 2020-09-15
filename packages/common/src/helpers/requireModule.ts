import { PortablePath } from '../types';

export default function requireModule<T>(path: PortablePath): T {
  // eslint-disable-next-line
  let value = require(String(path));

  // Support Babel compiled files
  // eslint-disable-next-line no-underscore-dangle
  if (value?.__esModule) {
    value = value.default as T;
  }

  return value;
}
