import { Predicates } from '@boost/common';
import Transport from './Transport';
import { TransportOptions, LogItem } from './types';
import { LOG_LEVELS } from './constants';

export default class ConsoleTransport extends Transport<TransportOptions> {
  constructor(options?: Partial<TransportOptions>) {
    super({
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
