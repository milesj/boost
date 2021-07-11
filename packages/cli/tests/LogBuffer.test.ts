import LogBuffer from '../src/LogBuffer';

describe('LogBuffer', () => {
	it('removes listener when calling return function', () => {
		const spy = jest.fn();
		const buffer = new LogBuffer(process.stdout);

		const undo = buffer.on(spy);

		// @ts-expect-error
		expect(buffer.listener).toBe(spy);

		undo();

		// @ts-expect-error
		expect(buffer.listener).toBeUndefined();
	});
});
