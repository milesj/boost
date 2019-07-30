export type LogLevel = 'debug' | 'error' | 'log' | 'info' | 'trace' | 'warn';

export type LogLevelLabels = { [L in LogLevel]?: string };

export interface Logger {
  (message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  disable(): void;
  enable(): void;
  error(message: string, ...args: unknown[]): void;
  log(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  trace(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
}
