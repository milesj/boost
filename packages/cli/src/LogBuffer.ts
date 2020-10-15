/* eslint-disable no-console */

import { Loggable, LogLevel } from '@boost/log';
import { StreamType } from './types';

type BufferListener = (buffer: string[]) => void;
type UnwrapHandler = () => void;

const NOTIFY_DELAY = 100;
const CONSOLE_METHODS: { [K in StreamType]: LogLevel[] } = {
  stderr: ['error', 'trace', 'warn'],
  stdout: ['debug', 'log', 'info'],
};

export default class LogBuffer {
  logs: string[] = [];

  protected listener?: BufferListener;

  protected stream: NodeJS.WriteStream;

  protected timer?: NodeJS.Timeout;

  protected type: StreamType;

  protected unwrappers: UnwrapHandler[] = [];

  protected wrapped: boolean = false;

  constructor(type: StreamType, stream: NodeJS.WriteStream) {
    this.type = type;
    this.stream = stream;
  }

  flush = () => {
    if (this.logs.length > 0) {
      if (this.listener) {
        this.listener(this.logs);
      } else {
        this.logs.forEach(this.writeToStream);
      }

      this.logs = [];
    }

    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
  };

  off() {
    this.flush();

    delete this.listener;
  }

  on(listener: BufferListener) {
    this.listener = listener;
  }

  unwrap() {
    this.flush();

    this.unwrappers.forEach((unwrap) => {
      unwrap();
    });

    this.wrapped = false;
  }

  wrap(logger: Loggable) {
    CONSOLE_METHODS[this.type].forEach((method) => {
      const original = console[method];

      console[method] = logger[method];

      this.unwrappers.push(() => {
        console[method] = original;
      });
    });

    this.wrapped = true;
  }

  write = (message: unknown) => {
    const msg = `${String(message).trimEnd()}\n`;

    if (this.wrapped) {
      this.logs.push(msg);

      // Place in a short timeout so that we can batch
      if (!this.timer) {
        this.timer = setTimeout(this.flush, NOTIFY_DELAY);
      }
    } else {
      this.writeToStream(msg);
    }
  };

  protected writeToStream = (message: string) => {
    this.stream.write(message);
  };
}
