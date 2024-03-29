import { describe, expect, it } from 'vitest';
import { Renderer } from './__fixtures__/Renderer';

describe('Plugin', () => {
	it('accepts options in the constructor', () => {
		const plugin = new Renderer({ value: 'foo' });

		expect(plugin.options).toEqual({ value: 'foo' });
	});
});
