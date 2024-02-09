import type { LoggerFunction } from '.';

/**
 * Returns a Vitest spy that matches the return value shape of `createLogger`.
 *
 * ```ts
 * import { mockLogger } from '@boost/log/test';
 *
 * it('calls the logger', async () => {
 * 	const log = await mockLogger();
 *
 * 	log('Something has happened');
 *
 * 	expect(log).toHaveBeenCalled();
 * });
 * ```
 */
export async function mockLogger(): Promise<LoggerFunction> {
	const { vi } = await import('vitest');
	const log = vi.fn() as any;

	log.disable = vi.fn();
	log.enable = vi.fn();
	log.debug = vi.fn();
	log.error = vi.fn();
	log.log = vi.fn();
	log.info = vi.fn();
	log.trace = vi.fn();
	log.warn = vi.fn();

	return log;
}
