import debug, { Debugger } from 'debug';

export function sentenceCase(value: unknown): string {
	return String(value)
		.replace(/[A-Z]/gu, (match) => ` ${match.toLocaleLowerCase()}`)
		.trim();
}

debug.formatters.S = sentenceCase;

export function createInternalDebugger(namespace: string): Debugger {
	return debug(`boost:${namespace}`);
}
