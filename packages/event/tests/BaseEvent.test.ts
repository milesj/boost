import { beforeEach, describe, expect, it } from 'vitest';
import { Event } from '../src/Event';

describe('Event', () => {
	let event: Event<unknown[]>;

	beforeEach(() => {
		event = new Event('event.test');
	});

	describe('constructor()', () => {
		it('errors if name contains invalid characters', () => {
			expect(() => new Event('foo+bar')).toThrowErrorMatchingSnapshot();
		});
	});

	describe('clearListeners()', () => {
		it('deletes all listeners in a scope', () => {
			event.listen(() => {}, 'foo');
			event.listen(() => {}, 'bar');
			event.listen(() => {}, 'baz');

			expect(event.getListeners('foo').size).toBe(1);
			expect(event.getListeners('bar').size).toBe(1);
			expect(event.getListeners('baz').size).toBe(1);

			event.clearListeners('foo');

			expect(event.getListeners('foo').size).toBe(0);
			expect(event.getListeners('bar').size).toBe(1);
			expect(event.getListeners('baz').size).toBe(1);
		});

		it('deletes all listeners across all scopes', () => {
			event.listen(() => {}, 'foo');
			event.listen(() => {}, 'bar');
			event.listen(() => {}, 'baz');

			expect(event.getListeners('foo').size).toBe(1);
			expect(event.getListeners('bar').size).toBe(1);
			expect(event.getListeners('baz').size).toBe(1);

			event.clearListeners();

			expect(event.getListeners('foo').size).toBe(0);
			expect(event.getListeners('bar').size).toBe(0);
			expect(event.getListeners('baz').size).toBe(0);
		});
	});

	describe('getListeners()', () => {
		it('errors if scope contains invalid characters', () => {
			expect(() => event.getListeners('foo+bar')).toThrowErrorMatchingSnapshot();
		});

		it('doesnt error for default scope', () => {
			expect(() => event.getListeners()).not.toThrow();
		});

		it('creates the listeners set if it does not exist', () => {
			expect(event.listeners.has('foo')).toBe(false);

			const set = event.getListeners('foo');

			expect(set).toBeInstanceOf(Set);
			expect(event.listeners.has('foo')).toBe(true);
		});
	});

	describe('getScopes()', () => {
		it('returns an array of scope names', () => {
			event.getListeners();
			event.getListeners('foo');
			event.getListeners('bar');
			event.getListeners('baz');

			expect(event.getScopes()).toEqual(['*', 'foo', 'bar', 'baz']);
		});
	});

	describe('listen()', () => {
		it('errors if listener is not a function', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				event.listen(123);
			}).toThrowErrorMatchingSnapshot();
		});

		it('adds a listener to the default scope', () => {
			const listener = () => {};

			expect(event.getListeners().has(listener)).toBe(false);

			event.listen(listener);

			expect(event.getListeners().has(listener)).toBe(true);
		});

		it('adds a listener to a specific scope', () => {
			const listener = () => {};

			expect(event.getListeners('foo').has(listener)).toBe(false);

			event.listen(listener, 'foo');

			expect(event.getListeners('foo').has(listener)).toBe(true);
		});

		it('removes a listener from the default scope', () => {
			const listener = () => {};

			const unlisten = event.listen(listener);

			expect(event.getListeners().has(listener)).toBe(true);

			unlisten();

			expect(event.getListeners().has(listener)).toBe(false);
		});

		it('removes a listener from a specific scope', () => {
			const listener = () => {};

			const unlisten = event.listen(listener, 'foo');

			expect(event.getListeners('foo').has(listener)).toBe(true);

			unlisten();

			expect(event.getListeners('foo').has(listener)).toBe(false);
		});
	});

	describe('unlisten()', () => {
		it('removes a listener from the default scope', () => {
			const listener = () => {};

			event.listen(listener);

			expect(event.getListeners().has(listener)).toBe(true);

			event.unlisten(listener);

			expect(event.getListeners().has(listener)).toBe(false);
		});

		it('removes a listener from a specific scope', () => {
			const listener = () => {};

			event.listen(listener, 'foo');

			expect(event.getListeners('foo').has(listener)).toBe(true);

			event.unlisten(listener, 'foo');

			expect(event.getListeners('foo').has(listener)).toBe(false);
		});
	});

	describe('once()', () => {
		it('errors if listener is not a function', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				event.once(123);
			}).toThrowErrorMatchingSnapshot();
		});

		it('adds a listener to the default scope', () => {
			const listener = () => {};

			expect(event.getListeners().size).toBe(0);

			event.once(listener);

			expect(event.getListeners().has(listener)).toBe(false);
			expect(event.getListeners().size).toBe(1);
		});

		it('adds a listener to a specific scope', () => {
			const listener = () => {};

			expect(event.getListeners('foo').size).toBe(0);

			event.once(listener, 'foo');

			expect(event.getListeners('foo').has(listener)).toBe(false);
			expect(event.getListeners('foo').size).toBe(1);
		});

		it('removes the listener once executed', () => {
			let count = 0;
			const listener = () => {
				count += 1;
			};

			event.once(listener);

			expect(event.getListeners().size).toBe(1);

			event.emit([]);
			event.emit([]);
			event.emit([]);

			expect(event.getListeners().size).toBe(0);
			expect(count).toBe(1);
		});
	});
});
