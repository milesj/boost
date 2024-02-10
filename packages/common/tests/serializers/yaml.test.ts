import path from 'node:path';
import { describe, expect, it } from 'vitest';
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
		expect(yaml.load(path.join(__dirname, '__fixtures__/test.yaml'))).toEqual(data);
	});
});
