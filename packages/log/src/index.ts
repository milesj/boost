/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import color from 'chalk';
import createLogger, { LoggerOptions } from './createLogger';
import isAllowedLogLevel from './isAllowedLogLevel';

export * from './constants';
export * from './types';

export { color, createLogger, isAllowedLogLevel, LoggerOptions };
