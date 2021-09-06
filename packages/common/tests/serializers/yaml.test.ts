import * as yaml from '../../src/serializers/yaml';

describe('yaml', () => {
	const data = {
		foo: 123,
		bar: true,
		baz: 'abc',
		qux: {},
	};

	it('serializes and parses yaml', () => {
		expect(yaml.parse(yaml.stringify(data))).toEqual(data);
	});

	it('loads and parses from a file', () => {
		expect(yaml.load(new URL('./__fixtures__/test.yaml', import.meta.url))).toEqual(data);
	});
});
