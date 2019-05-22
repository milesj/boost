import debug from 'debug';

export interface Debugger extends debug.IDebugger {
  (message: string, ...args: any[]): void;
  enable(): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
  verbose(message: string, ...args: any[]): void;
}
