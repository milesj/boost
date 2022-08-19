import os from 'os';
import { Contract } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { LOG_LEVELS } from './constants';
import * as formats from './formats';
import { Formatter, LogItem, LogLevel, Transportable, TransportOptions } from './types';

export abstract class Transport<Options extends TransportOptions>
	extends Contract<Options>
	implements Transportable
{
	readonly levels: LogLevel[] = [];

	constructor(options: Options) {
		super(options);

		this.levels = this.options.levels;
	}

	blueprint(schemas: Schemas): Blueprint<TransportOptions> {
		const { array, func, string } = schemas;

		return {
			eol: string(os.EOL),
			format: func<Formatter>(),
			levels: array().of(string().oneOf(LOG_LEVELS)),
		};
	}

	/**
	 * Format the log item into a message string, and append a trailing newline if missing.
	 */
	format(item: LogItem): string {
		const { eol, format } = this.options;

		let output = typeof format === 'function' ? format(item) : formats.debug(item);

		if (eol && !output.endsWith(eol)) {
			output += String(eol);
		}

		return output;
	}

	/**
	 * Write the formatted message according to the transport.
	 */
	abstract write(message: string, item: LogItem): Promise<void> | void;
}
