/* eslint-disable no-magic-numbers */

import React from 'react';
import { render } from 'ink';
import { stripAnsi } from '@boost/terminal';

// Fake process.stdout
class Stream {
  columns: number;

  output: string;

  constructor({ columns }: { columns?: number }) {
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

export function renderToString(element: React.ReactElement, columns?: number): string {
  const stream = new Stream({ columns });

  render(element, {
    debug: true,
    experimental: true,
    stdout: (stream as unknown) as NodeJS.WriteStream,
  });

  return stream.get();
}

export function renderToStrippedString(element: React.ReactElement, columns?: number): string {
  return stripAnsi(renderToString(element, columns));
}
