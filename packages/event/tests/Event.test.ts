import Event from '../src/Event';

describe('Event', () => {
	let event: Event<[string, string, string]>;

	beforeEach(() => {
		event = new Event('event.test');
	});

	it('executes listeners synchronously while passing values to each', () => {
		let value = 'foo';

		event.listen(() => {
			value = value.toUpperCase();
		});
		event.listen(() => {
			value = value.split('').reverse().join('');
		});
		event.listen(() => {
			value = `${value}-${value}`;
		});

		event.emit(['', '', '']);

		expect(value).toBe('OOF-OOF');
	});

	it('executes listeners synchronously with arguments', () => {
		const value: string[] = [];

		event.listen((a) => {
			value.push(a.repeat(3));
		});
		event.listen((a, b) => {
			value.push(b.repeat(2));
		});
		event.listen((a, b, c) => {
			value.push(c.repeat(1));
		});

		event.emit(['foo', 'bar', 'baz']);

		expect(value).toEqual(['foofoofoo', 'barbar', 'baz']);
	});
});
