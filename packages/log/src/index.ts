/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import createLogger, { LoggerOptions } from './createLogger';
import isAllowedLogLevel from './isAllowedLogLevel';

export * from './constants';
export * from './types';

export { createLogger, isAllowedLogLevel, LoggerOptions };
