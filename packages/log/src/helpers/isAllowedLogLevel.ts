import { LogLevel } from '../types';
import { LOG_LEVELS } from '../constants';

export default function isAllowedLogLevel(level: LogLevel, maxLevel?: LogLevel): boolean {
  if (!maxLevel) {
    return true;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const currentLevel of LOG_LEVELS) {
    if (currentLevel === level) {
      return true;
    }

    if (currentLevel === maxLevel) {
      break;
    }
  }

  return false;
}
