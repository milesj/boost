import debug, { Debugger } from 'debug';

export default function createInternalDebugger(namespace: string): Debugger {
  return debug(`boost:${namespace}`);
}
