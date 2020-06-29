export type LogLevel = 'debug' | 'error' | 'log' | 'info' | 'trace' | 'warn';

export type LogLevelLabels = { [L in LogLevel]?: string };

export interface LogItem {
  host: string;
  label: string;
  level: LogLevel;
  message: string;
  name: string;
  pid: number;
  time: string;
}

export type LogWriter = (message: string, ...args: unknown[]) => void;

export interface Loggable {
  debug: LogWriter;
  disable: () => void;
  enable: () => void;
  error: LogWriter;
  log: LogWriter;
  info: LogWriter;
  trace: LogWriter;
  warn: LogWriter;
}

export interface LoggerFunction extends Loggable {
  (message: string, ...args: unknown[]): void;
}

export interface LoggerOptions {
  /** Custom labels to use for each log type. */
  labels?: LogLevelLabels;
  /** Unique name for this logger. */
  name: string;
  /** Transports to write messages to. */
  transports?: Transportable[];
}

export interface Writable {
  write: LogWriter;
}

export type Formatter = (item: LogItem) => string;

export interface Transportable {
  levels: LogLevel[];
  format: Formatter;
  write: (message: string, item: LogItem) => void | Promise<void>;
}

export interface TransportOptions {
  format?: Formatter | null;
  levels: LogLevel[];
}
