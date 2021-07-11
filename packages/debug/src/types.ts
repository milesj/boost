import debug from 'debug';

export interface Debugger extends debug.IDebugger {
	(message: string, ...args: unknown[]): void;
	disable: () => void;
	enable: () => void;
	invariant: (condition: boolean, message: string, pass: string, fail: string) => void;
	verbose: (message: string, ...args: unknown[]) => void;
}
