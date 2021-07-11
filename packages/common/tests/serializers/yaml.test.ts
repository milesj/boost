import * as yaml from '../../src/serializers/yaml';

describe('yaml', () => {
	it('serializes and parses yaml', () => {
		const data = {
			foo: 123,
			bar: true,
			baz: 'abc',
			qux: {},
		};

		expect(yaml.parse(yaml.stringify(data))).toEqual(data);
	});
});
