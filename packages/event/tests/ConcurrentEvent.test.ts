import ConcurrentEvent from '../src/ConcurrentEvent';

describe('ConcurrentEvent', () => {
	let event: ConcurrentEvent<[number]>;

	beforeEach(() => {
		event = new ConcurrentEvent('parallel.test');
	});

	it('returns a promise', () => {
		expect(event.emit([0])).toBeInstanceOf(Promise);
	});

	it('executes listeners asynchronously with arguments', async () => {
		const output: number[] = [];

		function getRandom() {
			return Math.round(Math.random() * (500 - 0) + 0);
		}

		event.listen(
			(value) =>
				new Promise<number>((resolve) => {
					setTimeout(() => {
						resolve(value * 2);
					}, getRandom());
				}),
		);
		event.listen(
			(value) =>
				new Promise<number>((resolve) => {
					setTimeout(() => {
						resolve(value * 3);
					}, getRandom());
				}),
		);
		event.listen(
			(value) =>
				new Promise<number>((resolve) => {
					setTimeout(() => {
						resolve(value * 4);
					}, getRandom());
				}),
		);

		await event.emit([1]);

		expect(output).not.toEqual([2, 3, 4]);
	});
});
