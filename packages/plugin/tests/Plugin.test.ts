import { Renderer } from './__mocks__/Renderer';

describe('Plugin', () => {
	it('accepts options in the constructor', () => {
		const plugin = new Renderer({ value: 'foo' });

		expect(plugin.options).toEqual({ value: 'foo' });
	});
});
