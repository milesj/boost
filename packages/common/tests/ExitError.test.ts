import { ExitError } from '../src/ExitError';
import { describe, it, expect } from 'vitest';

describe('ExitError', () => {
	it('sets the message and exit code', () => {
		const error = new ExitError('Oops', 3);

		expect(error.message).toBe('Oops');
		expect(error.code).toBe(3);
	});
});
