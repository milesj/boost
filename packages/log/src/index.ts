/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import createLogger from './createLogger';
import * as formats from './formats';
import Logger from './Logger';
import Transport from './Transport';
import ConsoleTransport from './transports/ConsoleTransport';
import FileTransport from './transports/FileTransport';
import RotatingFileTransport from './transports/RotatingFileTransport';
import StreamTransport from './transports/StreamTransport';

export * from './constants';
export * from './types';

export {
  ConsoleTransport,
  createLogger,
  FileTransport,
  formats,
  Logger,
  RotatingFileTransport,
  StreamTransport,
  Transport,
};
