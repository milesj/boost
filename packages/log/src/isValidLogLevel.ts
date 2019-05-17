import { LogLevel } from './types';
import { LOG_LEVELS } from './constants';

export default function isValidLogLevel(level: LogLevel): boolean {
  const maxLevel = process.env.BOOST_LOG_MAX_LEVEL;

  if (!maxLevel) {
    return true;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const currentLevel of LOG_LEVELS) {
    if (currentLevel === level) {
      return true;
    }

    if (currentLevel === maxLevel) {
      return false;
    }
  }

  return false;
}
