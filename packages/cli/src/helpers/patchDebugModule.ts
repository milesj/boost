/* eslint-disable no-console */

import { internalRequire } from './internalRequire';

/**
 * Wrap the `debug` stream since it writes to `process.stderr` directly.
 * https://www.npmjs.com/package/debug#output-streams
 */
export function patchDebugModule(): () => void {
	if (!process.env.DEBUG) {
		return () => {};
	}

	const debug = internalRequire('debug') as typeof import('debug');
	const originalLog = debug.log;

	debug.log = console.error.bind(console);

	return () => {
		debug.log = originalLog;
	};
}
