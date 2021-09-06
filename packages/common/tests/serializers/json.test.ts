import * as json from '../../src/serializers/json';

describe('json', () => {
	const data = {
		foo: 123,
		bar: true,
		baz: 'abc',
		qux: {},
	};

	it('serializes and parses json', () => {
		expect(json.parse(json.stringify(data))).toEqual(data);
	});

	it('loads and parses from a file', () => {
		expect(json.load(new URL('./__fixtures__/test.json', import.meta.url))).toEqual(data);
	});
});
