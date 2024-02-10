import debug from 'debug';
import { describe, expect, it, vi } from 'vitest';
import { patchDebugModule } from '../../src/helpers/patchDebugModule';

describe('patchDebugModule()', () => {
	it('wraps `debug`', () => {
		// We need to set env var before hand
		process.env.DEBUG = '*';

		const inst = debug('boostcli:test');
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const unpatch = patchDebugModule();

		debug.enable('boostcli:*');
		inst('Debugging');

		expect(spy).toHaveBeenCalledWith(expect.stringContaining('boostcli:test Debugging'));

		unpatch();
		spy.mockRestore();
	});
});
