import { formatMs } from '../../src/helpers/formatMs';

describe('formatMs()', () => {
	it('handles zero', () => {
		expect(formatMs(0)).toBe('0s');
	});

	it('formats large milliseconds', () => {
		expect(formatMs(482_639_237)).toBe('5d 14h 3m 59.2s');
	});
});
