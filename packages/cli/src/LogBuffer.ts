/* eslint-disable no-console */

import { StreamType } from './types';

type BufferListener = (buffer: string[]) => void;
type UnwrapHandler = () => void;
type ConsoleMethod = keyof typeof console;

const NOTIFY_DELAY = 250;
const CONSOLE_METHODS: { [K in StreamType]: ConsoleMethod[] } = {
  stderr: ['error', 'trace', 'warn'],
  stdout: ['debug', 'log', 'info'],
};

export default class LogBuffer {
  protected listener?: BufferListener;

  protected logs: string[] = [];

  protected timer?: NodeJS.Timeout;

  protected type: StreamType;

  protected unwrappers: UnwrapHandler[] = [];

  constructor(type: StreamType) {
    this.type = type;
  }

  flush = () => {
    if (this.listener) {
      this.listener(this.logs);
    }

    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }

    this.logs = [];
  };

  off() {
    this.flush();

    delete this.listener;
  }

  on(listener: BufferListener) {
    this.listener = listener;
  }

  unwrap() {
    this.unwrappers.forEach(unwrap => {
      unwrap();
    });
  }

  wrap() {
    CONSOLE_METHODS[this.type].forEach(method => {
      const original = console[method].bind(console);

      console[method] = this.write;

      this.unwrappers.push(() => {
        console[method] = original;
      });
    });
  }

  write = (message: string) => {
    // Static component will render each item in the array as a new line,
    // so trim surrounding new lines here
    this.logs.push(message.trim());

    // Place in a timeout so that we can batch
    if (!this.timer) {
      this.timer = setTimeout(this.flush, NOTIFY_DELAY);
    }
  };
}
