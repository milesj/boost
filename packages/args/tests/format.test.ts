import { format } from '../src';
import { describe, it, expect } from 'vitest';

describe('format()', () => {
	it('handles commands', () => {
		expect(format({ command: ['foo'] })).toEqual(['foo']);
	});

	it('handles sub-commands', () => {
		expect(format({ command: ['foo', 'bar', 'baz'] })).toEqual(['foo:bar:baz']);
	});

	it('handles string option', () => {
		expect(format({ options: { string: 'abc' } })).toEqual(['--string', 'abc']);
	});

	it('handles string option with multiple values', () => {
		expect(format({ options: { strings: ['abc', 'xyz'] } })).toEqual(['--strings', 'abc', 'xyz']);
	});

	it('handles number option', () => {
		expect(format({ options: { number: 123 } })).toEqual(['--number', '123']);
	});

	it('handles number option with multiple values', () => {
		expect(format({ options: { numbers: [123, 456] } })).toEqual(['--numbers', '123', '456']);
	});

	it('handles boolean true option', () => {
		expect(format({ options: { bool: true } })).toEqual(['--bool']);
	});

	it('handles boolean false option', () => {
		expect(format({ options: { bool: false } })).toEqual(['--no-bool']);
	});

	it('handles params', () => {
		expect(format({ params: ['foo', 'bar baz', './filePath.js'] })).toEqual([
			'foo',
			'bar baz',
			'./filePath.js',
		]);
	});

	it('handles non-string params', () => {
		expect(
			format({
				// @ts-expect-error Invalid type
				params: [123, 45.67, true, false],
			}),
		).toEqual(['123', '45.67', 'true', 'false']);
	});

	it('handles rest args', () => {
		expect(format({ params: ['foo'], rest: ['bar', '--baz'] })).toEqual([
			'foo',
			'--',
			'bar',
			'--baz',
		]);
	});

	it('handles everything', () => {
		expect(
			format({
				command: ['cmd'],
				options: { string: 'abc', numbers: [123, 456], bool: true },
				params: ['foo', 'bar', 'baz'],
				rest: ['qux', '--version'],
			}),
		).toEqual([
			'cmd',
			'--string',
			'abc',
			'--numbers',
			'123',
			'456',
			'--bool',
			'foo',
			'bar',
			'baz',
			'--',
			'qux',
			'--version',
		]);
	});
});
