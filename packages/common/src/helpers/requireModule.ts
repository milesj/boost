import Path from '../Path';
import { FilePath } from '../types';

export default function requireModule<T>(path: Path | FilePath): T {
  let value = require(String(path)); // eslint-disable-line

  // Support Babel compiled files
  // eslint-disable-next-line no-underscore-dangle
  if (value && value.__esModule) {
    value = value.default;
  }

  return value;
}
