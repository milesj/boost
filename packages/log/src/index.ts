/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import createLogger from './createLogger';
import Logger from './Logger';
import isAllowedLogLevel from './helpers/isAllowedLogLevel';
import Transport from './Transport';
import ConsoleTransport from './ConsoleTransport';
import StreamTransport from './StreamTransport';
import * as formats from './formats';

export * from './constants';
export * from './types';

export {
  createLogger,
  formats,
  isAllowedLogLevel,
  Logger,
  Transport,
  ConsoleTransport,
  StreamTransport,
};
