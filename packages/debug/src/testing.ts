import { Debugger } from './types';

export function mockDebugger(): Debugger {
  const debug = jest.fn() as any;

  debug.disable = jest.fn();
  debug.enable = jest.fn();
  debug.invariant = jest.fn();
  debug.verbose = jest.fn();

  return debug;
}
