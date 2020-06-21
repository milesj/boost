import debug from 'debug';

export interface Debugger extends debug.IDebugger {
  disable: () => void;
  enable: () => void;
  invariant: (condition: boolean, message: string, pass: string, fail: string) => void;
  verbose: (message: string, ...args: unknown[]) => void;
  (message: string, ...args: unknown[]): void;
}
