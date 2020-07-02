import os from 'os';
import { Contract, Predicates, Blueprint } from '@boost/common';
import { Transportable, TransportOptions, LogItem, LogLevel, Formatter } from './types';
import * as formats from './formats';
import { LOG_LEVELS } from './constants';

export default abstract class Transport<Options extends TransportOptions> extends Contract<Options>
  implements Transportable {
  readonly levels: LogLevel[] = [];

  constructor(options: Options) {
    super(options);

    this.levels = this.options.levels;
  }

  blueprint({ array, func, string }: Predicates): Blueprint<TransportOptions> {
    return {
      eol: string(os.EOL),
      format: func<Formatter>().nullable(),
      levels: array(string().oneOf(LOG_LEVELS)),
    };
  }

  /**
   * Format the log item into a message string, and append a trailing newline if missing.
   */
  format(item: LogItem): string {
    const { eol, format } = this.options;

    let output = typeof format === 'function' ? format(item) : formats.debug(item);

    if (!output.endsWith(eol!)) {
      output += eol;
    }

    return output;
  }

  /**
   * Write the formatted message according to the transport.
   */
  abstract write(message: string, item: LogItem): void | Promise<void>;
}
