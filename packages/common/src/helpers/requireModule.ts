import { PortablePath } from '../types';

export default function requireModule<T>(path: PortablePath): T {
  // eslint-disable-next-line
  let value = require(String(path));

  // Support Babel compiled files
  if (value?.__esModule) {
    value = value.default as T;
  }

  return value;
}
