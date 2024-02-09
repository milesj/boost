/* eslint-disable jest/prefer-spy-on */

import type { Debugger } from '.';

/**
 * Returns a Vitest spy that matches the return value shape of `createDebugger`.
 *
 * ```ts
 * import { mockDebugger } from '@boost/debug/test';
 *
 * it('calls the debugger', async () => {
 * 	const debug = await mockDebugger();
 *
 * 	debug('Something is broken!');
 *
 * 	expect(debug).toHaveBeenCalled();
 * });
 * ```
 */
export async function mockDebugger(): Promise<Debugger> {
	const { vi } = await import('vitest');
	const debug = vi.fn() as any;

	debug.disable = vi.fn();
	debug.enable = vi.fn();
	debug.invariant = vi.fn();
	debug.verbose = vi.fn();

	return debug;
}
