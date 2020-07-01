import fs from 'fs';
import { Path, PortablePath } from '@boost/common';
import { createTempFixtureFolder } from '@boost/test-utils';
import FileTransport from '../src/FileTransport';

describe('FileTransport', () => {
  let fixtureDir: string;

  beforeEach(() => {
    fixtureDir = createTempFixtureFolder();
  });

  function existsFile(path: PortablePath): boolean {
    return fs.existsSync(String(path));
  }

  function readFile(path: PortablePath): string {
    if (existsFile(path)) {
      return fs.readFileSync(String(path), 'utf8');
    }

    return '';
  }

  function sizeFile(path: PortablePath): number {
    if (existsFile(path)) {
      return fs.statSync(String(path)).size;
    }

    return 0;
  }

  async function closeStream(transport: FileTransport) {
    return new Promise((resolve, reject) => {
      if (transport.stream) {
        transport.stream.on('error', reject);
        transport.close(resolve);
      } else {
        resolve();
      }
    });
  }

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

    // @ts-expect-error
    transport.rotating = true;
    transport.write('Line 1\n');
    transport.write('Line 2, duh\n');

    await closeStream(transport);

    expect(readFile(path)).toBe('');

    // @ts-expect-error
    transport.rotating = false;
    transport.write('Line 3, of course\n');

    await closeStream(transport);

    expect(readFile(path)).toBe('Line 1\nLine 2, duh\nLine 3, of course\n');
  });

  it('increments file when writing if existing file is too large', async () => {
    const path = new Path(fixtureDir, 'existing.log');
    const rotPath = new Path(fixtureDir, 'existing.log.1');

    const transport = new FileTransport({ levels: ['log'], path, maxSize: 20 });

    transport.write('First line of content.');
    transport.write('Second line of content, yeah.');
    transport.write('And the third line of content...');

    await closeStream(transport);

    expect(existsFile(rotPath)).toBe(true);

    expect(readFile(rotPath)).toBe(
      'First line of content.Second line of content, yeah.And the third line of content...',
    );
  });

  describe('gzip', () => {
    it('increments file when writing if existing file is too large', async () => {
      const path = new Path(fixtureDir, 'archive.log');
      const rotPath = new Path(fixtureDir, 'archive.log.1.gz');

      const transport = new FileTransport({ levels: ['log'], path, maxSize: 20, gzip: true });

      transport.write('First line of content.');
      transport.write('Second line of content, yeah.');
      transport.write('And the third line of content...');

      await closeStream(transport);

      expect(existsFile(rotPath)).toBe(true);

      expect(sizeFile(rotPath)).toBe(70);
      expect(readFile(rotPath)).not.toBe(
        'First line of content.Second line of content, yeah.And the third line of content...',
      );
    });
  });
});
