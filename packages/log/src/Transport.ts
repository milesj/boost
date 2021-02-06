import os from 'os';
import { Blueprint, Contract, Predicates } from '@boost/common';
import { LOG_LEVELS } from './constants';
import * as formats from './formats';
import { Formatter, LogItem, LogLevel, Transportable, TransportOptions } from './types';

export default abstract class Transport<Options extends TransportOptions>
  extends Contract<Options>
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
  abstract write(message: string, item: LogItem): Promise<void> | void;
}
