import chalk from 'chalk';

export type LogLevel = 'debug' | 'error' | 'log' | 'info' | 'trace' | 'warn';

export type LogLevelColors = { [L in LogLevel]?: typeof chalk };

export type LogLevelLabels = { [L in LogLevel]?: string };

export interface Logger {
  (message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  log(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  trace(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}
