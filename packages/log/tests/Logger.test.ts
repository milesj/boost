import Logger from '../src/Logger';

describe('Logger', () => {
	let logger: Logger;

	beforeEach(() => {
		logger = new Logger({ name: 'test' });
	});

	describe('isAllowed()', () => {
		it('returns false for unknown level', () => {
			expect(
				logger.isAllowed(
					// @ts-expect-error
					'unknown',
					'log',
				),
			).toBe(false);
		});

		it('returns false for unknown max level', () => {
			expect(
				logger.isAllowed(
					'debug',
					// @ts-expect-error
					'unknown',
				),
			).toBe(true);
		});

		it('returns true for no max level', () => {
			expect(logger.isAllowed('debug')).toBe(true);
		});

		it('returns true if level is below max level', () => {
			expect(logger.isAllowed('debug', 'error')).toBe(true);
		});

		it('returns false if level is above max level', () => {
			expect(logger.isAllowed('error', 'debug')).toBe(false);
		});

		it('handles `log` max level', () => {
			const maxLevel = 'log';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(false);
			expect(logger.isAllowed('debug', maxLevel)).toBe(false);
			expect(logger.isAllowed('info', maxLevel)).toBe(false);
			expect(logger.isAllowed('warn', maxLevel)).toBe(false);
			expect(logger.isAllowed('error', maxLevel)).toBe(false);
		});

		it('handles `trace` max level', () => {
			const maxLevel = 'trace';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(true);
			expect(logger.isAllowed('debug', maxLevel)).toBe(false);
			expect(logger.isAllowed('info', maxLevel)).toBe(false);
			expect(logger.isAllowed('warn', maxLevel)).toBe(false);
			expect(logger.isAllowed('error', maxLevel)).toBe(false);
		});

		it('handles `debug` max level', () => {
			const maxLevel = 'debug';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(true);
			expect(logger.isAllowed('debug', maxLevel)).toBe(true);
			expect(logger.isAllowed('info', maxLevel)).toBe(false);
			expect(logger.isAllowed('warn', maxLevel)).toBe(false);
			expect(logger.isAllowed('error', maxLevel)).toBe(false);
		});

		it('handles `info` max level', () => {
			const maxLevel = 'info';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(true);
			expect(logger.isAllowed('debug', maxLevel)).toBe(true);
			expect(logger.isAllowed('info', maxLevel)).toBe(true);
			expect(logger.isAllowed('warn', maxLevel)).toBe(false);
			expect(logger.isAllowed('error', maxLevel)).toBe(false);
		});

		it('handles `warn` max level', () => {
			const maxLevel = 'warn';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(true);
			expect(logger.isAllowed('debug', maxLevel)).toBe(true);
			expect(logger.isAllowed('info', maxLevel)).toBe(true);
			expect(logger.isAllowed('warn', maxLevel)).toBe(true);
			expect(logger.isAllowed('error', maxLevel)).toBe(false);
		});

		it('handles `error` max level', () => {
			const maxLevel = 'error';

			expect(logger.isAllowed('log', maxLevel)).toBe(true);
			expect(logger.isAllowed('trace', maxLevel)).toBe(true);
			expect(logger.isAllowed('debug', maxLevel)).toBe(true);
			expect(logger.isAllowed('info', maxLevel)).toBe(true);
			expect(logger.isAllowed('warn', maxLevel)).toBe(true);
			expect(logger.isAllowed('error', maxLevel)).toBe(true);
		});
	});
});
