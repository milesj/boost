/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable unicorn/no-hex-escape, no-param-reassign */

import chalk from 'chalk';
import optimal, { bool, number, string, Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';
import themePalettes from './themes';
import { Color, ColorType, ColorPalette } from './types';

export const REFRESH_RATE = 100;
export const BG_REFRESH_RATE = 500;
export const SLOW_THRESHOLD = 10000; // ms

export interface WrappedStream {
  (message: string): boolean;
}

export interface ReporterOptions extends Struct {
  footer: string;
  refreshRate: number;
  silent: boolean;
  slowThreshold: number;
  theme: string;
  verbose: 0 | 1 | 2 | 3;
}

export interface ReporterInterface extends ModuleInterface {
  err: WrappedStream;
  out: WrappedStream;
  bootstrap(cli: ConsoleInterface): void;
}

export default class Reporter<T, To extends ReporterOptions> extends Module<To>
  implements ReporterInterface {
  bufferedOutput: string = '';

  bufferedStreams: (() => void)[] = [];

  err: WrappedStream;

  errorLogs: string[] = [];

  intervalTimer?: NodeJS.Timer;

  lastOutputHeight: number = 0;

  lines: T[] = [];

  logs: string[] = [];

  options: To;

  out: WrappedStream;

  renderScheduled: boolean = false;

  renderTimer?: NodeJS.Timer;

  restoreCursorOnExit: boolean = false;

  startTime: number = 0;

  stopTime: number = 0;

  constructor(options: Partial<To> = {}) {
    super(options);

    this.options = optimal(
      options,
      {
        footer: string().empty(),
        refreshRate: number(REFRESH_RATE),
        silent: bool(),
        slowThreshold: number(SLOW_THRESHOLD),
        theme: string('default'),
        verbose: number(3).between(0, 3, true),
      },
      {
        name: this.constructor.name,
        unknown: true,
      },
    );

    this.err = process.stderr.write.bind(process.stderr);
    this.out = process.stdout.write.bind(process.stdout);
  }

  /**
   * Register console listeners.
   */
  bootstrap(cli: ConsoleInterface) {
    cli.on('start', this.handleBaseStart);
    cli.on('stop', this.handleBaseStop);
    cli.on('log', this.handleLogMessage);
    cli.on('log.error', this.handleErrorMessage);
  }

  /**
   * Add a line to be rendered.
   */
  addLine(line: T): this {
    this.lines.push(line);

    return this;
  }

  /**
   * Clear the entire console.
   */
  clearOutput(): this {
    this.out('\x1Bc');
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Clear defined lines from the console.
   */
  clearLinesOutput(): this {
    this.out('\x1B[1A\x1B[K'.repeat(this.lastOutputHeight));
    this.lastOutputHeight = 0;

    return this;
  }

  /**
   * Debounce the render as to avoid tearing.
   */
  debounceRender(): this {
    if (this.renderScheduled) {
      return this;
    }

    this.renderScheduled = true;
    this.renderTimer = setTimeout(this.handleRender, this.options.refreshRate);

    return this;
  }

  /**
   * Display an error and it's stack.
   */
  displayError(error: Error): void {
    this.err(`\n${this.style(error.message, 'failure', ['bold'])}\n`);

    // Remove message line from stack
    if (error.stack) {
      const stack = this.style(
        error.stack
          .split('\n')
          .slice(1)
          .join('\n'),
      );

      this.err(`${stack}\n`);
    }

    this.err('\n');
  }

  /**
   * Display the final output when an error occurs, or when all routines are complete.
   */
  displayFinalOutput(error?: Error | null) {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }

    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
    }

    this.handleRender();

    // Manually triggered errors should take precedence
    if (this.errorLogs.length > 0) {
      this.displayLogs(this.errorLogs);
      this.displayFooter();

      // System errors (uncaught, unhandled, etc) should be isolated
    } else if (error) {
      this.displayError(error);

      // Everything went alright
    } else {
      this.displayLogs(this.logs);
      this.displayFooter();
    }
  }

  /**
   * Display logs in the final output.
   */
  displayLogs(logs: string[]) {
    if (logs.length > 0) {
      this.out(`\n${logs.join('\n')}\n`);
    }
  }

  /**
   * Display a footer after all other output.
   */
  displayFooter() {
    const { footer } = this.options;
    const time = this.getElapsedTime(this.startTime, this.stopTime, false);

    if (footer) {
      this.out(`${footer} ${this.style(`(${time})`)}\n`);
    } else {
      this.out(this.style(`Ran in ${time}\n`));
    }
  }

  /**
   * Find a line using a callback
   */
  findLine(callback: (item: T) => boolean): T | undefined {
    return this.lines.find(line => callback(line));
  }

  /**
   * Flush buffered output that has been logged.
   */
  flushBufferedOutput(): this {
    const lines = this.bufferedOutput;

    if (lines) {
      this.out(lines);
      this.lastOutputHeight = Math.max(lines.split('\n').length - 1, 0);
    }

    this.bufferedOutput = '';

    return this;
  }

  /**
   * Flush buffered streams output after clearing lines rendered by the reporter.
   */
  flushBufferedStreams(): this {
    this.bufferedStreams.forEach(buffer => {
      buffer();
    });

    return this;
  }

  /**
   * Calculate the elapsed time and highlight as red if over the threshold.
   */
  getElapsedTime(start: number, stop: number = 0, highlight: boolean = true): string {
    const time = (stop || Date.now()) - start;
    const isSlow = time > this.options.slowThreshold;

    // eslint-disable-next-line no-magic-numbers
    const elapsed = `${(time / 1000).toFixed(2)}s`;

    return isSlow && highlight ? this.style(elapsed, 'failure') : elapsed;
  }

  /**
   * Return a specific color for each task status.
   */
  getColorType(task: TaskInterface): ColorType {
    if (task.isSkipped()) {
      return 'warning';
    } else if (task.hasPassed()) {
      return 'success';
    } else if (task.hasFailed()) {
      return 'failure';
    }

    return 'pending';
  }

  /**
   * Return specific colors based on chosen theme.
   */
  getColorPalette(): ColorPalette {
    const { theme } = this.options;

    if (chalk.level >= 2 && themePalettes[theme]) {
      return themePalettes[theme];
    }

    return {
      failure: 'red',
      pending: 'gray',
      success: 'green',
      warning: 'yellow',
    };
  }

  /**
   * Handle the entire rendering and flushing process.
   */
  handleRender = () => {
    this.clearLinesOutput();
    this.flushBufferedStreams();
    this.render();
    this.flushBufferedOutput();
    this.renderScheduled = false;
  };

  /**
   * Set start time.
   */
  handleBaseStart = () => {
    this.err = this.wrapStream(process.stderr);
    this.out = this.wrapStream(process.stdout);
    this.startTime = Date.now();

    // Continuously update if a routine is taking too long
    if (!process.env.CI || process.env.CI !== 'true') {
      this.intervalTimer = setInterval(this.handleRender, BG_REFRESH_RATE);
    }
  };

  /**
   * Set stop time and render.
   */
  handleBaseStop = (error: Error | null) => {
    this.stopTime = Date.now();
    this.displayFinalOutput(error);
    this.unwrapStream(process.stderr);
    this.unwrapStream(process.stdout);
  };

  /**
   * Store the log.
   */
  handleLogMessage = (message: string) => {
    this.logs.push(message);
  };

  /**
   * Store the error.
   */
  handleErrorMessage = (message: string) => {
    this.errorLogs.push(message);
  };

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.out('\x1B[?25l');

    if (!this.restoreCursorOnExit) {
      this.restoreCursorOnExit = true;

      /* istanbul ignore next */
      process.on('exit', () => {
        this.showCursor();
      });
    }

    return this;
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number = 0): string {
    return ' '.repeat(length);
  }

  /**
   * Log a message to `stdout` without a trailing newline or formatting.
   */
  log(message: string, nl: number = 0): this {
    if (!this.options.silent) {
      this.bufferedOutput += message + '\n'.repeat(nl);
    }

    return this;
  }

  /**
   * Remove a line to be rendered.
   */
  removeLine(callback: (item: T) => boolean): this {
    this.lines = this.lines.filter(line => !callback(line));

    return this;
  }

  /**
   * Render output.
   */
  render() {
    this.lines.forEach(line => {
      this.log(String(line), 1);
    });
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.out(`\x1B[${process.stdout.rows};0H`);

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    this.out('\x1B[?25h');

    return this;
  }

  /**
   * Create a chalk formatted string with accessible colors and modifiers applied.
   */
  style(
    message: string,
    type: ColorType = 'pending',
    modifiers: ('reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden')[] = [],
  ): string {
    const color = this.getColorPalette()[type];
    let out = color.charAt(0) === '#' ? chalk.hex(color) : chalk[color as Color];

    modifiers.forEach(modifier => {
      out = out[modifier];
    });

    return out(message);
  }

  /**
   * Unwrap a stream and reset it back to normal.
   */
  unwrapStream(stream: NodeJS.WriteStream): void {
    if (process.env.NODE_ENV !== 'test') {
      // @ts-ignore
      stream.write = stream.originalWrite;
    }
  }

  /**
   * Wrap a stream and buffer the output as to not collide with our reporter.
   */
  /* istanbul ignore next */
  wrapStream(stream: NodeJS.WriteStream): WrappedStream {
    const originalWrite = stream.write.bind(stream);

    if (process.env.NODE_ENV === 'test') {
      return originalWrite;
    }

    let buffer = '';

    const write = (message: string) => {
      if (stream.isTTY) {
        originalWrite(message);
      }

      return true;
    };

    const flushBuffer = () => {
      if (stream.isTTY && buffer) {
        originalWrite(buffer);
      }

      buffer = '';
    };

    this.bufferedStreams.push(flushBuffer);

    stream.write = (chunk: string) => {
      buffer += String(chunk);

      return true;
    };

    // @ts-ignore
    stream.originalWrite = originalWrite;

    return write;
  }
}
