import debug from 'debug';

export interface Debugger extends debug.IDebugger {
	/** Log a message to the console and interpolate with the parameters. */
	(message: string, ...params: unknown[]): void;
	/** Disable all debugger messages from logging to the console. */
	disable: () => void;
	/** Enable all debugger messages to log the console. */
	enable: () => void;
	/** Log a pass or fail message based on a conditional. */
	invariant: (condition: boolean, message: string, pass: string, fail: string) => void;
	/** Log verbose messages that only appear when the `BOOSTJS_DEBUG_VERBOSE` is set. */
	verbose: (message: string, ...params: unknown[]) => void;
}
