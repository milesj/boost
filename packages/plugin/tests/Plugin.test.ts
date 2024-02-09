import { Renderer } from './__fixtures__/Renderer';
import { describe, it, expect } from 'vitest';

describe('Plugin', () => {
	it('accepts options in the constructor', () => {
		const plugin = new Renderer({ value: 'foo' });

		expect(plugin.options).toEqual({ value: 'foo' });
	});
});
