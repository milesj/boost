import { describe, expect, it, vi } from 'vitest';
import { LogBuffer } from '../src/LogBuffer';

describe('LogBuffer', () => {
	it('removes listener when calling return function', () => {
		const spy = vi.fn();
		const buffer = new LogBuffer(process.stdout);

		const undo = buffer.on(spy);

		// @ts-expect-error Allow access
		expect(buffer.listener).toBe(spy);

		undo();

		// @ts-expect-error Allow access
		expect(buffer.listener).toBeUndefined();
	});
});
