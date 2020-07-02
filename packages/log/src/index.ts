/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import createLogger from './createLogger';
import Logger from './Logger';
import Transport from './Transport';
import ConsoleTransport from './transports/ConsoleTransport';
import FileTransport from './transports/FileTransport';
import RotatingFileTransport from './transports/RotatingFileTransport';
import StreamTransport from './transports/StreamTransport';
import * as formats from './formats';

export * from './constants';
export * from './types';

export {
  createLogger,
  formats,
  Logger,
  Transport,
  ConsoleTransport,
  FileTransport,
  RotatingFileTransport,
  StreamTransport,
};
