import { Path } from '../types';

export default function requireModule<T>(path: Path): T {
  let value = require(path); // eslint-disable-line

  // Support Babel compiled files
  // eslint-disable-next-line no-underscore-dangle
  if (value && value.__esModule) {
    value = value.default;
  }

  return value;
}
