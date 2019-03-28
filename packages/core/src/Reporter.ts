import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import cliTruncate from 'cli-truncate';
import cliSize from 'term-size';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import Console from './Console';
import ModuleLoader from './ModuleLoader';
import Output, { StringRenderer } from './Output';
import ProgressOutput, { ProgressRenderer } from './outputs/ProgressOutput';
import Plugin from './Plugin';
import Routine from './Routine';
import Task from './Task';
import formatTime from './helpers/formatTime';
import { Color, ColorType, ColorPalette, OutputLevel } from './types';

let restoreCursorOnExit = false;

export const SLOW_THRESHOLD = 10000; // ms

export default class Reporter<Options extends object = {}> extends Plugin<Options> {
  // eslint-disable-next-line no-magic-numbers
  static BUFFER = 10;

  static OUTPUT_COMPACT = 1;

  static OUTPUT_NORMAL = 2;

  static OUTPUT_VERBOSE = 3;

  // @ts-ignore Set after instantiation
  console: Console;

  startTime: number = 0;

  stopTime: number = 0;

  /**
   * Register console listeners.
   */
  bootstrap() {
    this.console.onStart.listen(this.handleBaseStart);
    this.console.onStop.listen(this.handleBaseStop);
  }

  /**
   * Calculate the current number of tasks that have completed.
   */
  calculateTaskCompletion(tasks: Task<any>[]): number {
    return tasks.reduce((sum, task) => (task.hasPassed() || task.isSkipped() ? sum + 1 : sum), 0);
  }

  /**
   * Create a new output to be rendered with the defined renderer function.
   * Concurrent outputs will be rendered in parallel with other concurrent
   * outputs and the top of the queue output.
   */
  createConcurrentOutput(renderer: StringRenderer): Output {
    const output = this.createOutput(renderer);
    output.concurrent();

    return output;
  }

  /**
   * Create a new output to be rendered with the defined renderer function.
   */
  createOutput(renderer: StringRenderer): Output {
    return new Output(this.console, renderer);
  }

  /**
   * Create a new output to continuously render a progress bar.
   */
  createProgressOutput(renderer: ProgressRenderer): ProgressOutput {
    return new ProgressOutput(this.console, renderer);
  }

  /**
   * Display an error and it's stack.
   */
  displayError(error: Error): void {
    this.console.err(`\n${this.style(error.message, 'failure', ['bold'])}\n`);

    // Remove message line from stack
    if (error.stack) {
      this.console.err(
        this.style(error.stack.replace(`Error: ${error.message}\n`, ''), 'pending'),
        1,
      );
    }

    this.console.err('\n');
  }

  /**
   * Return specific colors based on chosen theme.
   */
  getColorPalette(): ColorPalette {
    const { theme = 'default' } = this.tool.config;
    const palette =
      chalk.level >= 2 && theme !== 'default'
        ? new ModuleLoader<ColorPalette>(this.tool, 'theme', null, ['boost']).loadModule(theme)
        : {};

    return {
      default: 'white',
      failure: 'red',
      pending: 'gray',
      success: 'green',
      warning: 'yellow',
      ...palette,
    };
  }

  /**
   * Return a specific color for each task status.
   */
  getColorType(task: Task<any>): ColorType {
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
   * Calculate the elapsed time and highlight as red if over the threshold.
   */
  getElapsedTime(start: number, stop: number = 0, highlight: boolean = true): string {
    const time = (stop || Date.now()) - start;
    const isSlow = time > SLOW_THRESHOLD;
    const elapsed = formatTime(time);

    return isSlow && highlight ? this.style(elapsed, 'failure') : elapsed;
  }

  /**
   * Return the output level: 1 (compact), 2 (normal), 3 (verbose).
   */
  getOutputLevel(): OutputLevel {
    return this.tool.config.output;
  }

  /**
   * Return the root parent (depth of 0) in the current routine tree.
   */
  getRootParent(routine: Routine<any, any>): Routine<any, any> {
    let current = routine;

    while (current.metadata.depth > 0 && current.parent) {
      current = current.parent;
    }

    return current;
  }

  /**
   * Set start time.
   */
  handleBaseStart = () => {
    this.startTime = Date.now();
  };

  /**
   * Set stop time and render.
   */
  handleBaseStop = () => {
    this.stopTime = Date.now();
  };

  /**
   * Return true if the user's terminal supports color.
   */
  hasColorSupport(level: number = 1): boolean {
    return chalk.supportsColor && chalk.supportsColor.level >= level;
  }

  /**
   * Hide the console cursor.
   */
  hideCursor(): this {
    this.console.out(ansiEscapes.cursorHide);

    if (!restoreCursorOnExit) {
      restoreCursorOnExit = true;

      process.on('exit', () => {
        process.stdout.write(ansiEscapes.cursorShow);
      });
    }

    return this;
  }

  /**
   * Create an indentation based on the defined length.
   */
  indent(length: number = 0): string {
    return length <= 0 ? '' : ' '.repeat(length);
  }

  /**
   * Return true if the final render.
   */
  isFinalRender(): boolean {
    return this.console.isFinalRender();
  }

  /**
   * Return true if the there should be no output.
   */
  isSilent(): boolean {
    return this.tool.config.silent;
  }

  /**
   * Reset the cursor back to the bottom of the console.
   */
  resetCursor(): this {
    this.console.out(ansiEscapes.cursorTo(0, this.size().rows));

    return this;
  }

  /**
   * Show the console cursor.
   */
  showCursor(): this {
    this.console.out(ansiEscapes.cursorShow);

    return this;
  }

  /**
   * Return size information about the terminal window.
   */
  size(): { columns: number; rows: number } {
    return cliSize();
  }

  /**
   * Sort all tasks by start time and filter to remove pending tasks.
   */
  sortTasksByStartTime<T extends Task<any>>(tasks: T[]): T[] {
    return [...tasks].sort((a, b) => a.metadata.startTime - b.metadata.startTime);
  }

  /**
   * Strip ANSI escape characters from a string.
   */
  strip(message: string): string {
    return stripAnsi(message);
  }

  /**
   * Create a chalk formatted string with accessible colors and modifiers applied.
   */
  style(
    message: string,
    type: ColorType = 'default',
    modifiers: ('reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden')[] = [],
  ): string {
    if (!this.hasColorSupport()) {
      return message;
    }

    const color = this.getColorPalette()[type];
    let out = color.charAt(0) === '#' ? chalk.hex(color) : chalk[color as Color];

    modifiers.forEach(modifier => {
      out = out[modifier];
    });

    return out(message);
  }

  /**
   * Truncate a string that contains ANSI escape characters to a specific column width.
   */
  truncate(
    message: string,
    columns?: number,
    options?: { position?: 'start' | 'middle' | 'end' },
  ): string {
    return cliTruncate(message, columns || this.size().columns, options);
  }

  /**
   * Wrap a string that contains ANSI escape characters to a specific column width.
   */
  wrap(
    message: string,
    columns?: number,
    options?: { hard?: boolean; trim?: boolean; wordWrap?: boolean },
  ): string {
    return wrapAnsi(message, columns || this.size().columns, {
      hard: true,
      trim: false,
      ...options,
    });
  }
}

export function testOnlyResetRestoreCursor() {
  if (process.env.NODE_ENV === 'test') {
    restoreCursorOnExit = false;
  }
}
