/* eslint-disable no-magic-numbers, max-classes-per-file */

import React from 'react';
import { render } from 'ink';
import { stripAnsi } from '@boost/terminal';

export class ReadStream {
  isTTY = false;
}

export class WriteStream {
  columns: number = 80;

  output: string;

  constructor() {
    this.output = '';
  }

  write(string: string) {
    this.output = string;
  }

  get(): string {
    return this.output;
  }
}

export async function renderToString(element: React.ReactElement): Promise<string> {
  const stdout = new WriteStream();

  await render(element, {
    debug: true,
    experimental: true,
    stdout: (stdout as unknown) as NodeJS.WriteStream,
  });

  return stdout.get();
}

export async function renderToStrippedString(element: React.ReactElement): Promise<string> {
  return stripAnsi(await renderToString(element));
}
