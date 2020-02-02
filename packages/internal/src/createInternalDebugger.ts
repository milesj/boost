import debug, { Debugger } from 'debug';

debug.formatters.S = function sentenceCase(value: unknown): string {
  return String(value)
    .replace(/[A-Z]/gu, match => ` ${match.toLocaleLowerCase()}`)
    .trim();
};

export default function createInternalDebugger(namespace: string): Debugger {
  return debug(`boost:${namespace}`);
}
