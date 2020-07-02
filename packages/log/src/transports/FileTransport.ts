import fs from 'fs';
import zlib from 'zlib';
import { PortablePath, Path, Blueprint, Predicates } from '@boost/common';
import Transport from '../Transport';
import { TransportOptions } from '../types';
import { MAX_LOG_SIZE } from '../constants';

export interface FileTransportOptions extends TransportOptions {
  gzip?: boolean;
  maxSize?: number;
  path: PortablePath;
}

export default class FileTransport<
  Options extends FileTransportOptions = FileTransportOptions
> extends Transport<Options> {
  readonly path: Path;

  stream?: NodeJS.WritableStream;

  protected buffer: string = '';

  protected draining: boolean = false;

  protected lastSize: number = 0;

  protected rotating: boolean = false;

  constructor(options: Options) {
    super(options);

    this.path = Path.resolve(this.options.path);

    this.checkFolderRequirements();
  }

  blueprint(preds: Predicates): Blueprint<FileTransportOptions> {
    const { bool, instance, union, number, string } = preds;

    return {
      ...super.blueprint(preds),
      gzip: bool(),
      maxSize: number(MAX_LOG_SIZE).positive(),
      path: union([string(), instance(Path)], '').required(),
    };
  }

  /**
   * Close the file stream and trigger the callback when finished.
   */
  close(cb?: () => void) {
    const onClose = () => {
      if (cb) {
        cb();
      }

      this.stream = undefined;
    };

    if (this.stream) {
      this.stream.once('finish', onClose).end();
    } else {
      onClose();
    }
  }

  /**
   * Open the file stream for writing.
   */
  open(): NodeJS.WritableStream {
    if (this.stream) {
      return this.stream;
    }

    this.stream = this.createStream();

    if (this.path.exists()) {
      this.lastSize = fs.statSync(this.path.path()).size;
    }

    if (this.buffer) {
      const message = this.buffer;

      this.buffer = '';
      this.write(message);
    }

    return this.stream;
  }

  /**
   * Write a message to the file stream, and rotate files once written if necessary.
   */
  write(message: string) {
    if (this.rotating) {
      this.buffer += message;

      return;
    }

    const stream = this.open();
    const written = stream.write(message, 'utf8', () => {
      this.lastSize += Buffer.byteLength(message);
      this.checkIfNeedsRotation();
    });

    // istanbul ignore next
    if (!written) {
      this.draining = true;

      stream.once('drain', () => {
        this.draining = false;
      });
    }
  }

  /**
   * Check that the parent folder exists and has the correct permissions.
   */
  protected checkFolderRequirements() {
    fs.mkdirSync(this.path.parent().path(), { recursive: true });
  }

  /**
   * Check if we should change and rotate files because of max size.
   */
  protected checkIfNeedsRotation() {
    if (this.lastSize > this.options.maxSize) {
      this.closeStreamAndRotateFile();
    }
  }

  /**
   * Open and create a file stream for the defined path.
   * Apply file size and gzip checks.
   */
  protected createStream() {
    const stream = fs.createWriteStream(this.path.path(), {
      encoding: 'utf8',
      flags: 'a',
    });

    // Apply gzip compression to the stream
    if (this.options.gzip) {
      const gzip = zlib.createGzip();

      gzip.pipe(stream);

      return gzip;
    }

    return stream;
  }

  /**
   * Return the file name with extension, of the newly rotated file.
   */
  protected getRotatedFileName(): string {
    return this.path.name();
  }

  /**
   * Count the number of files within path directory that matches the given file name.
   */
  protected getNextIncrementCount(name: string): number {
    const files = fs.readdirSync(this.path.parent().path());
    // eslint-disable-next-line security/detect-non-literal-regexp
    const pattern = new RegExp(`^${name}.\\d+$`, 'u');
    let count = 0;

    files.forEach((file) => {
      if (file.match(pattern)) {
        count += 1;
      }
    });

    return count;
  }

  /**
   * Close the open stream and attempt to rotate the file.
   */
  protected closeStreamAndRotateFile() {
    // istanbul ignore next
    if (this.draining || this.rotating) {
      return;
    }

    this.rotating = true;
    this.close(() => {
      this.rotateFile();
      this.rotating = false;
    });
  }

  /**
   * Rotate the current file into a new file with an incremented name.
   */
  protected rotateFile() {
    let fileName = this.getRotatedFileName();

    if (this.options.gzip) {
      fileName += '.gz';
    }

    fileName += `.${this.getNextIncrementCount(fileName)}`;

    fs.renameSync(this.path.path(), this.path.parent().append(fileName).path());

    this.lastSize = 0;
  }
}
