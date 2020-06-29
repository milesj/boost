import { Predicates } from '@boost/common';
import Transport from './Transport';
import { LOG_LEVELS } from './constants';
import * as formats from './formats';
import { TransportOptions, LogItem } from './types';

export default class ConsoleTransport extends Transport<TransportOptions> {
  constructor(options?: Partial<TransportOptions>) {
    super({
      format: formats.console,
      levels: LOG_LEVELS,
      ...options,
    });
  }

  blueprint(preds: Predicates) {
    return this.sharedBlueprint(preds);
  }

  write(message: string, { level }: LogItem) {
    // eslint-disable-next-line no-console
    console[level](message.trim());
  }
}
