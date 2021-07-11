export type LogLevel = 'debug' | 'error' | 'info' | 'log' | 'trace' | 'warn';

export type LogLevelLabels = { [L in LogLevel]?: string };

export interface LogMetadata {
	[field: string]: unknown;
}

export interface LogItem {
	host: string;
	label: string;
	level: LogLevel;
	message: string;
	metadata: LogMetadata;
	name: string;
	pid: number;
	time: Date;
}

export interface LoggableWriter {
	(metadata: LogMetadata, message: string, ...args: unknown[]): void;
	(message: string, ...args: unknown[]): void;
}

export interface Loggable {
	debug: LoggableWriter;
	disable: () => void;
	enable: () => void;
	error: LoggableWriter;
	log: LoggableWriter;
	info: LoggableWriter;
	trace: LoggableWriter;
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
	/** Transports to write messages to. */
	transports?: Transportable[];
}

export interface Writable {
	write: (message: string) => void;
}

export type Formatter = (item: LogItem) => string;

export interface Transportable {
	levels: LogLevel[];
	format: Formatter;
	write: (message: string, item: LogItem) => Promise<void> | void;
}

export interface TransportOptions {
	eol?: string;
	format?: Formatter | null;
	levels: LogLevel[];
}

export type Rotation = 'daily' | 'hourly' | 'monthly' | 'weekly';
