import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Path } from '@boost/common';
import { createTempFixtureFolder } from '@boost/test-utils';
import { FileTransport } from '../../src/transports/FileTransport';
import {
	closeStream,
	existsFile,
	readFile,
	sizeFile,
	wait as waitForWrite,
	writeFile,
} from './helpers';

describe('FileTransport', () => {
	let fixtureDir: string;

	beforeEach(() => {
		fixtureDir = createTempFixtureFolder();
	});

	it('triggers close callback if stream has not been opened', async () => {
		const spy = vi.fn();
		const path = new Path(fixtureDir, 'current.log');
		const transport = new FileTransport({ levels: ['log'], path });

		transport.close(spy);

		await closeStream(transport);

		expect(spy).toHaveBeenCalled();
	});

	it('writes messages to the given log file', async () => {
		const path = new Path(fixtureDir, 'current.log');
		const transport = new FileTransport({ levels: ['log'], path });

		transport.write('Line 1\n');
		transport.write('Line 2, duh\n');
		transport.write('Line 3, of course\n');

		await closeStream(transport);

		expect(readFile(path)).toBe('Line 1\nLine 2, duh\nLine 3, of course\n');
	});

	it('buffers messages to the given log file if rotating', async () => {
		const path = new Path(fixtureDir, 'current.log');
		const transport = new FileTransport({ levels: ['log'], path });

		transport.write('Line 1\n');

		// @ts-expect-error Allow access
		transport.rotating = true;
		transport.write('Line 2, duh\n');

		await closeStream(transport);

		expect(readFile(path)).toBe('Line 1\n');

		// @ts-expect-error Allow access
		transport.rotating = false;
		transport.write('Line 3, of course\n');

		await closeStream(transport);

		expect(readFile(path)).toBe('Line 1\nLine 2, duh\nLine 3, of course\n');
	});

	it('inherits correct file size on open', async () => {
		const path = new Path(fixtureDir, 'current.log');
		const transport = new FileTransport({ levels: ['log'], path });

		writeFile(path, 'This is the initial content.\n');

		transport.open(); // Trigger open

		// @ts-expect-error Allow access
		expect(sizeFile(path)).toBe(transport.lastSize);

		transport.write('Line 1\n');

		await closeStream(transport);

		expect(readFile(path)).toBe('This is the initial content.\nLine 1\n');
	});

	it('rotates file when writing if existing file is too large', async () => {
		const path = new Path(fixtureDir, 'existing.log');
		const rotPath = new Path(fixtureDir, 'existing.log.0');

		const transport = new FileTransport({ levels: ['log'], path, maxSize: 35 });

		transport.write('First line of content.');

		await waitForWrite(50);

		transport.write('Second line of content, yeah.');

		await waitForWrite(50);

		transport.write('And the third line of content...');

		await closeStream(transport);

		expect(existsFile(path)).toBe(true);
		expect(existsFile(rotPath)).toBe(true);

		expect(readFile(path)).toBe('And the third line of content...');
		expect(readFile(rotPath)).toBe('First line of content.Second line of content, yeah.');
	});

	it('increments the file name counter for each match', async () => {
		const path = new Path(fixtureDir, 'existing.log');
		const rot0Path = new Path(fixtureDir, 'existing.log.0');
		const rot1Path = new Path(fixtureDir, 'existing.log.1');
		const rot2Path = new Path(fixtureDir, 'existing.log.2');

		const transport = new FileTransport({ levels: ['log'], path, maxSize: 20 });

		transport.write('First line of content.');

		await waitForWrite(50);

		transport.write('Second line of content, yeah.');

		await waitForWrite(50);

		transport.write('And the third line of content...');

		await closeStream(transport);

		expect(readFile(rot2Path)).toBe('And the third line of content...');
		expect(readFile(rot1Path)).toBe('Second line of content, yeah.');
		expect(readFile(rot0Path)).toBe('First line of content.');
	});

	describe('gzip', () => {
		it('rotates file when writing if existing file is too large', async () => {
			const path = new Path(fixtureDir, 'archive.log');
			const rotPath = new Path(fixtureDir, 'archive.log.gz.0');

			const transport = new FileTransport({ levels: ['log'], path, maxSize: 35, gzip: true });

			transport.write('First line of content.');

			await waitForWrite(50);

			transport.write('Second line of content, yeah.');

			await waitForWrite(50);

			transport.write('And the third line of content...');

			await closeStream(transport);

			expect(existsFile(rotPath)).toBe(true);

			expect(sizeFile(rotPath)).toBe(55);
			expect(readFile(rotPath)).not.toBe('First line of content.Second line of content, yeah.');
		});
	});
});
