/* eslint-disable no-magic-numbers, max-classes-per-file */

import React from 'react';
import { render } from 'ink';
import { stripAnsi } from '@boost/terminal';

export class ReadStream {
  isTTY = false;

  setEncoding() {}

  off() {}

  on() {}
}

export class WriteStream {
  columns: number;

  output: string;

  constructor({ columns }: { columns?: number } = {}) {
    this.columns = columns || 100;
    this.output = '';
  }

  write(string: string) {
    this.output = string;
  }

  get(): string {
    return this.output;
  }
}

export async function renderToString(
  element: React.ReactElement,
  columns?: number,
): Promise<string> {
  const stdout = new WriteStream({ columns });

  await render(element, {
    debug: true,
    experimental: true,
    stdout: (stdout as unknown) as NodeJS.WriteStream,
  });

  return stdout.get();
}

export async function renderToStrippedString(
  element: React.ReactElement,
  columns?: number,
): Promise<string> {
  return stripAnsi(await renderToString(element, columns));
}
