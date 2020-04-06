/* eslint-disable no-console */

import { StreamType } from './types';

type BufferListener = (buffer: string[]) => void;
type UnwrapHandler = () => void;
type ConsoleMethod = keyof typeof console;

const NOTIFY_DELAY = 150;
const CONSOLE_METHODS: { [K in StreamType]: ConsoleMethod[] } = {
  stderr: [],
  stdout: [
    'debug',
    'log',
    'info',
    // Until ink supports stderr
    'error',
    'trace',
    'warn',
  ],
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

    this.unwrappers.forEach(unwrap => {
      unwrap();
    });

    this.wrapped = false;
  }

  wrap() {
    CONSOLE_METHODS[this.type].forEach(method => {
      const original = console[method];

      console[method] = this.write;

      this.unwrappers.push(() => {
        console[method] = original;
      });
    });

    this.wrapped = true;
  }

  write = (message: string) => {
    // `Static` will render each item in the array as a new line,
    // so trim surrounding new lines here
    const msg = message.trimEnd();

    // If not wrapping the console, just output immediately
    if (!this.wrapped) {
      this.writeToStream(msg);

      return;
    }

    // Static component will render each item in the array as a new line,
    // so trim surrounding new lines here
    this.logs.push(msg);

    // Place in a short timeout so that we can batch
    if (!this.timer) {
      this.timer = setTimeout(this.flush, NOTIFY_DELAY);
    }
  };

  protected writeToStream = (message: string) => {
    this.stream.write(`${message}\n`);
  };
}
