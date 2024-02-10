import path from 'node:path';
import { describe, expect,it } from 'vitest';
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
		expect(json.load(path.join(__dirname, '__fixtures__/test.json'))).toEqual(data);
	});
});
