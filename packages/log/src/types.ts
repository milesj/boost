export type LogLevel = 'debug' | 'error' | 'info' | 'log' | 'trace' | 'warn';

export type LogLevelLabels = { [L in LogLevel]?: string };

export type LogMetadata = Record<string, unknown>;

export interface LogItem {
	/** The name of the host machine. */
	host: string;
	/** The log level as a localized or customized label. */
	label: string;
	/** The log level as a string. */
	level: LogLevel;
	/** The log message with interpolated arguments applied. */
	message: string;
	/** Additional data to include with a log item. */
	metadata: LogMetadata;
	/** Name of the logger. */
	name: string;
	/** Current process ID. */
	pid: number;
	/** Timestamp of the log, native to the host machine. */
	time: Date;
}

export interface LogOptions {
	/** Values to interpolate into the message string. */
	args?: unknown[];
	/** Level to log as. */
	level?: LogLevel;
	/** Message to log to the transports. */
	message: string;
	/** Metadata to include in the message item/string. */
	metadata?: LogMetadata;
}

export interface LoggableWriter {
	/**
	 * Log a message to the console and interpolate with the parameters,
	 * while also providing a metadata object to include with the log item.
	 */
	(metadata: LogMetadata, message: string, ...params: unknown[]): void;
	/** Log a message to the console and interpolate with the parameters. */
	(message: string, ...params: unknown[]): void;
}

export interface Loggable {
	/** Log a message with the `debug` log level. */
	debug: LoggableWriter;
	/** Disable all logger messages from logging to the console. */
	disable: () => void;
	/** Enable all logger messages to log the console. */
	enable: () => void;
	/** Log a message with the `error` log level. */
	error: LoggableWriter;
	/** Log a message with the `log` log level. */
	log: LoggableWriter;
	/** Log a message with the `info` log level. */
	info: LoggableWriter;
	/** Log a message with the `trace` log level. */
	trace: LoggableWriter;
	/** Log a message with the `warn` log level. */
	warn: LoggableWriter;
}

export interface LoggerFunction extends Loggable, LoggableWriter {}

export interface LoggerOptions {
	/** Custom labels to use for each log type. */
	labels?: LogLevelLabels;
	/** Metadata to include within each log item. */
	metadata?: LogMetadata;
	/** Unique name for this logger. */
	name: string;
	/** List of transports to write messages to. */
	transports?: Transportable[];
}

export interface Writable {
	/** Write a message to the configured stream. */
	write: (message: string) => void;
}

export type Formatter = (item: LogItem) => string;

export interface Transportable {
	levels: LogLevel[];
	format: Formatter;
	/** Write a message and log item to the transport. */
	write: (message: string, item: LogItem) => Promise<void> | void;
}

export interface TransportOptions {
	/** End of line character to append to a message. Defaults to `os.EOL`. */
	eol?: string;
	/** Function to format a log item into a message string. Default is transport dependent. */
	format?: Formatter;
	/** List of log levels to only write messages for. */
	levels: LogLevel[];
}

export type Rotation = 'daily' | 'hourly' | 'monthly' | 'weekly';
