import { getFixturePath } from '@boost/test-utils';
import { parseFile } from '../../src/helpers/parseFile';
import { Path } from '../../src/Path';

describe('parseFile()', () => {
	it('errors if path is not absolute', () => {
		expect(() => {
			parseFile('../some/relative/path.js');
		}).toThrowErrorMatchingSnapshot();
	});

	it('errors for unsupported extension', () => {
		expect(() => {
			parseFile(getFixturePath('file-types', 'unknown.ext'));
		}).toThrowErrorMatchingSnapshot();
	});

	it('supports .js extension', () => {
		expect(parseFile(getFixturePath('file-types', 'js.js'))).toEqual({ type: 'js' });
	});

	it('supports .js extension via the `Path` class', () => {
		expect(parseFile(new Path(getFixturePath('file-types', 'js.js')))).toEqual({ type: 'js' });
	});

	it('supports .jsx extension', () => {
		expect(parseFile(getFixturePath('file-types', 'jsx.jsx'))).toEqual({ jsx: true, type: 'js' });
	});

	it('supports .ts extension', () => {
		expect(parseFile(getFixturePath('file-types', 'ts.ts'))).toEqual({ type: 'ts' });
	});

	it('supports .tsx extension', () => {
		expect(parseFile(getFixturePath('file-types', 'tsx.tsx'))).toEqual({ type: 'tsx' });
	});

	it('supports .json extension', () => {
		expect(parseFile(getFixturePath('file-types', 'json.json'))).toEqual({ type: 'json' });
	});

	it('supports .json5 extension', () => {
		expect(parseFile(getFixturePath('file-types', 'json5.json5'))).toEqual({ type: 'json5' });
	});

	it('supports .yaml extension', () => {
		expect(parseFile(getFixturePath('file-types', 'yaml.yaml'))).toEqual({ type: 'yaml' });
	});

	it('supports .yml extension', () => {
		expect(parseFile(getFixturePath('file-types', 'yml.yml'))).toEqual({
			short: true,
			type: 'yaml',
		});
	});
});
