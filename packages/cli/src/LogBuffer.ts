/* eslint-disable no-console, @typescript-eslint/no-unsafe-assignment */

import { StreamType } from './types';

type UnwrapHandler = () => void;
type ConsoleMethod = keyof typeof console;

const CONSOLE_METHODS: { [K in StreamType]: ConsoleMethod[] } = {
  stderr: ['error', 'trace', 'warn'],
  stdout: ['debug', 'log', 'info'],
};

export default class LogBuffer {
  logs: string[] = [];

  protected stream: NodeJS.WriteStream;

  protected type: StreamType;

  protected unwrappers: UnwrapHandler[] = [];

  protected wrapped: boolean = false;

  constructor(type: StreamType, stream: NodeJS.WriteStream) {
    this.type = type;
    this.stream = stream;
  }

  flush = () => {
    if (this.logs.length > 0) {
      this.logs.forEach(this.writeToStream);
      this.logs = [];
    }
  };

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
    const msg =
      typeof String.prototype.trimEnd === 'function'
        ? String(message).trimEnd()
        : String(message).trim(); // Node 8

    if (this.wrapped) {
      this.logs.push(msg);
    } else {
      this.writeToStream(msg);
    }
  };

  protected writeToStream = (message: string) => {
    this.stream.write(`${message}\n`);
  };
}
