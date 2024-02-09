import { WaterfallEvent } from '../src/WaterfallEvent';
import { describe, it, expect } from 'vitest';

describe('WaterfallEvent', () => {
	it('executes listeners in order with the value being passed to each function', () => {
		const event = new WaterfallEvent<string>('waterfall.test');

		event.listen((value) => `${value}B`);
		event.listen((value) => `${value}C`);
		event.listen((value) => `${value}D`);

		const output = event.emit('A');

		expect(output).toBe('ABCD');
	});

	it('supports arrays', () => {
		const event = new WaterfallEvent<string[]>('waterfall.array.test');

		event.listen((value) => [...value, 'B']);
		event.listen((value) => [...value, 'C']);
		event.listen((value) => [...value, 'D']);

		const output = event.emit(['A']);

		expect(output).toEqual(['A', 'B', 'C', 'D']);
	});

	it('supports objects', () => {
		const event = new WaterfallEvent<Record<string, string>>('waterfall.array.test');

		event.listen((value) => ({ ...value, B: 'B' }));
		event.listen((value) => ({ ...value, C: 'C' }));
		event.listen((value) => ({ ...value, D: 'D' }));

		const output = event.emit({ A: 'A' });

		expect(output).toEqual({
			A: 'A',
			B: 'B',
			C: 'C',
			D: 'D',
		});
	});
});
