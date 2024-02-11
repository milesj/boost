/* eslint-disable no-console */

import { createRequire } from 'node:module';

const requireDebug = createRequire(import.meta.url);

/**
 * Wrap the `debug` stream since it writes to `process.stderr` directly.
 * https://www.npmjs.com/package/debug#output-streams
 */
export function patchDebugModule(): () => void {
	if (!process.env.DEBUG) {
		return () => {};
	}

	const debug = requireDebug('debug') as typeof import('debug');
	const originalLog = debug.log;

	debug.log = console.error.bind(console);

	return () => {
		debug.log = originalLog;
	};
}
