/* eslint-disable jest/prefer-spy-on */

import type { LoggerFunction } from '.';

/**
 * Returns a Jest spy that matches the return value shape of `createLogger`.
 *
 * ```ts
 * import { mockLogger } from '@boost/log/test';
 *
 * it('calls the logger', () => {
 * 	const log = mockLogger();
 *
 * 	log('Something has happened');
 *
 * 	expect(log).toHaveBeenCalled();
 * });
 * ```
 */
export function mockLogger(): LoggerFunction {
	const log = jest.fn() as any;

	log.disable = jest.fn();
	log.enable = jest.fn();
	log.debug = jest.fn();
	log.error = jest.fn();
	log.log = jest.fn();
	log.info = jest.fn();
	log.trace = jest.fn();
	log.warn = jest.fn();

	return log;
}
