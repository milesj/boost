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

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  disable: () => void;
  enable: () => void;
  error: (message: string, ...args: unknown[]) => void;
  log: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  trace: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
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

export interface Loggable {
  write: (message: string) => void;
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
