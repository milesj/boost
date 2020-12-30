import { LOG_LEVELS } from '../constants';
import * as formats from '../formats';
import Transport from '../Transport';
import { LogItem, TransportOptions } from '../types';

export default class ConsoleTransport extends Transport<TransportOptions> {
  constructor(options?: Partial<TransportOptions>) {
    super({
      format: formats.console,
      levels: LOG_LEVELS,
      ...options,
    });
  }

  write(message: string, { level }: LogItem) {
    // eslint-disable-next-line no-console
    console[level](message.trim());
  }
}
