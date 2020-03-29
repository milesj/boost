/* eslint-disable no-console */

import { StreamType } from './types';

type BufferListener = (buffer: string[]) => void;
type UnwrapHandler = () => void;
type ConsoleMethod = keyof typeof console;

const NOTIFY_DELAY = 250;
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

  protected timer?: NodeJS.Timeout;

  protected type: StreamType;

  protected unwrappers: UnwrapHandler[] = [];

  constructor(type: StreamType) {
    this.type = type;
  }

  flush = () => {
    if (this.logs.length > 0) {
      if (this.listener) {
        this.listener(this.logs);
      } else {
        this.logs.forEach(log => {
          if (this.type === 'stderr') {
            console.error(log);
          } else {
            console.log(log);
          }
        });
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
  }

  wrap() {
    CONSOLE_METHODS[this.type].forEach(method => {
      const original = console[method];

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

    // Place in a short timeout so that we can batch
    if (!this.timer) {
      this.timer = setTimeout(this.flush, NOTIFY_DELAY);
    }
  };
}
