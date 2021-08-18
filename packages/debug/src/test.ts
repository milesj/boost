/* eslint-disable jest/prefer-spy-on */

import type { Debugger } from '.';

/**
 * Returns a Jest spy that matches the return value shape of `createDebugger`.
 *
 * ```ts
 * import { mockDebugger } from '@boost/debug/test';
 *
 * it('calls the debugger', () => {
 * 	const debug = mockDebugger();
 *
 * 	debug('Something is broken!');
 *
 * 	expect(debug).toHaveBeenCalled();
 * });
 * ```
 */
export function mockDebugger(): Debugger {
	const debug = jest.fn() as any;

	debug.disable = jest.fn();
	debug.enable = jest.fn();
	debug.invariant = jest.fn();
	debug.verbose = jest.fn();

	return debug;
}
