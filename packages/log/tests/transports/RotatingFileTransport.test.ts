import { Path } from '@boost/common';
import { createTempFixtureFolder } from '@boost/test-utils';
import { RotatingFileTransport } from '../../src/transports/RotatingFileTransport';
import { closeStream, existsFile, readFile, wait as waitForWrite } from './helpers';
import { describe, beforeEach, it, afterEach, vi, expect, MockInstance } from 'vitest';

describe('RotatingFileTransport', () => {
	let fixtureDir: string;
	let dateSpy: MockInstance;

	beforeEach(() => {
		fixtureDir = createTempFixtureFolder();
		dateSpy = vi
			.spyOn(Date, 'now')
			.mockImplementation(() => new Date(2020, 0, 1, 0, 0, 0).getTime());
	});

	afterEach(() => {
		dateSpy.mockRestore();
	});

	describe('formatTimestamp()', () => {
		let transport: RotatingFileTransport;

		beforeEach(() => {
			transport = new RotatingFileTransport({
				levels: ['log'],
				path: 'test.log',
				rotation: 'daily',
			});
		});

		it('supports hourly', () => {
			transport.configure({
				rotation: 'hourly',
			});

			expect(transport.formatTimestamp(new Date(2020, 0, 1, 0, 0, 0).getTime())).toBe(
				'20200101.00',
			);
			expect(transport.formatTimestamp(new Date(1998, 6, 15, 13, 0, 0).getTime())).toBe(
				'19980715.13',
			);
			expect(transport.formatTimestamp(new Date(2010, 11, 28, 22, 0, 0).getTime())).toBe(
				'20101228.22',
			);
		});

		it('supports daily', () => {
			transport.configure({
				rotation: 'daily',
			});

			expect(transport.formatTimestamp(new Date(2020, 0, 1, 0, 0, 0).getTime())).toBe('20200101');
			expect(transport.formatTimestamp(new Date(1998, 6, 15, 0, 0, 0).getTime())).toBe('19980715');
			expect(transport.formatTimestamp(new Date(2010, 11, 28, 0, 0, 0).getTime())).toBe('20101228');
		});

		it('supports weekly', () => {
			transport.configure({
				rotation: 'weekly',
			});

			expect(transport.formatTimestamp(new Date(2020, 0, 1, 0, 0, 0).getTime())).toBe('202001.W1');
			expect(transport.formatTimestamp(new Date(1998, 6, 10, 0, 0, 0).getTime())).toBe('199807.W2');
			expect(transport.formatTimestamp(new Date(2010, 8, 17, 0, 0, 0).getTime())).toBe('201009.W3');
			expect(transport.formatTimestamp(new Date(1990, 3, 25, 0, 0, 0).getTime())).toBe('199004.W4');
			expect(transport.formatTimestamp(new Date(2000, 6, 29, 0, 0, 0).getTime())).toBe('200007.W5');
		});

		it('supports monthly', () => {
			transport.configure({
				rotation: 'monthly',
			});

			expect(transport.formatTimestamp(new Date(2020, 0, 1, 0, 0, 0).getTime())).toBe('202001');
			expect(transport.formatTimestamp(new Date(1998, 6, 1, 0, 0, 0).getTime())).toBe('199807');
			expect(transport.formatTimestamp(new Date(2010, 11, 1, 0, 0, 0).getTime())).toBe('201012');
		});
	});

	describe('hourly', () => {
		it('rotates file when dates change', async () => {
			const path = new Path(fixtureDir, 'hourly.log');
			const rotPath = new Path(fixtureDir, 'hourly-20200101.00.log.0');

			const transport = new RotatingFileTransport({ levels: ['log'], path, rotation: 'hourly' });

			transport.write('First line of content.');

			await waitForWrite(50);

			dateSpy.mockImplementation(() => new Date(2020, 0, 1, 6, 0, 0).getTime());

			transport.write('Second line of content, yeah.');

			await waitForWrite(50);

			transport.write('And the third line of content...');

			await closeStream(transport);

			expect(existsFile(rotPath)).toBe(true);

			expect(readFile(path)).toBe('And the third line of content...');
			expect(readFile(rotPath)).toBe('First line of content.Second line of content, yeah.');
		});
	});

	describe('daily', () => {
		it('rotates file when dates change', async () => {
			const path = new Path(fixtureDir, 'daily.log');
			const rotPath = new Path(fixtureDir, 'daily-20200101.log.0');

			const transport = new RotatingFileTransport({ levels: ['log'], path, rotation: 'daily' });

			transport.write('First line of content.');

			await waitForWrite(50);

			dateSpy.mockImplementation(() => new Date(2020, 0, 14, 0, 0, 0).getTime());

			transport.write('Second line of content, yeah.');

			await waitForWrite(50);

			transport.write('And the third line of content...');

			await closeStream(transport);

			expect(existsFile(rotPath)).toBe(true);

			expect(readFile(path)).toBe('And the third line of content...');
			expect(readFile(rotPath)).toBe('First line of content.Second line of content, yeah.');
		});
	});

	describe('weekly', () => {
		it('rotates file when dates change', async () => {
			const path = new Path(fixtureDir, 'weekly.log');
			const rotPath = new Path(fixtureDir, 'weekly-202001.W1.log.0');

			const transport = new RotatingFileTransport({ levels: ['log'], path, rotation: 'weekly' });

			transport.write('First line of content.');

			await waitForWrite(50);

			dateSpy.mockImplementation(() => new Date(2020, 0, 22, 0, 0, 0).getTime());

			transport.write('Second line of content, yeah.');

			await waitForWrite(50);

			transport.write('And the third line of content...');

			await closeStream(transport);

			expect(existsFile(rotPath)).toBe(true);

			expect(readFile(path)).toBe('And the third line of content...');
			expect(readFile(rotPath)).toBe('First line of content.Second line of content, yeah.');
		});
	});

	describe('monthly', () => {
		it('rotates file when dates change', async () => {
			const path = new Path(fixtureDir, 'monthly.log');
			const rotPath = new Path(fixtureDir, 'monthly-202001.log.0');

			const transport = new RotatingFileTransport({ levels: ['log'], path, rotation: 'monthly' });

			transport.write('First line of content.');

			await waitForWrite(50);

			dateSpy.mockImplementation(() => new Date(2020, 5, 1, 0, 0, 0).getTime());

			transport.write('Second line of content, yeah.');

			await waitForWrite(50);

			transport.write('And the third line of content...');

			await closeStream(transport);

			expect(existsFile(rotPath)).toBe(true);

			expect(readFile(path)).toBe('And the third line of content...');
			expect(readFile(rotPath)).toBe('First line of content.Second line of content, yeah.');
		});
	});
});
