/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import cliTruncate from 'cli-truncate';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import Console from './Console';
import ModuleLoader from './ModuleLoader';
import Plugin from './Plugin';
import Task from './Task';
import themePalettes from './themes';
import { Color, ColorType, ColorPalette } from './types';

export const SLOW_THRESHOLD = 10000; // ms

export default class Reporter<Line = any, Options = {}> extends Plugin<Options> {
  // @ts-ignore Set after instantiation
  console: Console;

  lines: Line[] = [];

  startTime: number = 0;

  stopTime: number = 0;

  /**
   * Register console listeners.
   */
  bootstrap() {
    this.console.on('start', this.handleBaseStart).on('stop', this.handleBaseStop);
  }

  /**
   * Add a line to be rendered.
   */
  addLine(line: Line): this {
    this.lines.push(line);

    return this;
  }

  /**
   * Display an error and it's stack.
   */
  displayError(error: Error): void {
    this.console.write(`\n${this.style(error.message, 'failure', ['bold'])}\n`);

    // Remove message line from stack
    if (error.stack) {
      const stack = this.style(
        error.stack
          .split('\n')
          .slice(1)
          .join('\n')
          .trim(),
        'pending',
      );

      this.console.write(stack, 1);
    }

    this.console.write('\n');
  }

  /**
   * Find a line using a callback
   */
  findLine(callback: (item: Line) => boolean): Line | undefined {
    return this.lines.find(line => callback(line));
  }

  /**
   * Return specific colors based on chosen theme.
   */
  getColorPalette(): ColorPalette {
    const { theme } = this.tool.config;
    let palette = {};

    if (chalk.level >= 2) {
      if (themePalettes[theme]) {
        palette = themePalettes[theme];
      } else if (theme !== 'default') {
        palette = new ModuleLoader<ColorPalette>(this.tool, 'theme', null, true).loadModule(theme);
      }
    }

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
    } else if (task.isPending() || task.isRunning()) {
      return 'pending';
    }

    return 'default';
  }

  /**
   * Calculate the elapsed time and highlight as red if over the threshold.
   */
  getElapsedTime(start: number, stop: number = 0, highlight: boolean = true): string {
    const time = (stop || Date.now()) - start;
    const isSlow = time > SLOW_THRESHOLD;
    const elapsed = `${(time / 1000).toFixed(2)}s`; // eslint-disable-line no-magic-numbers

    return isSlow && highlight ? this.style(elapsed, 'failure') : elapsed;
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
   * Create an indentation based on the defined length.
   */
  indent(length: number = 0): string {
    return ' '.repeat(length);
  }

  /**
   * Remove a line to be rendered.
   */
  removeLine(callback: (line: Line) => boolean): this {
    this.lines = this.lines.filter(line => !callback(line));

    return this;
  }

  /**
   * Strip ANSI characters from a string.
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
    const color = this.getColorPalette()[type];
    let out = color.charAt(0) === '#' ? chalk.hex(color) : chalk[color as Color];

    modifiers.forEach(modifier => {
      out = out[modifier];
    });

    return out(message);
  }

  /**
   * Truncate a string that may contain ANSI characters to a specific column width.
   */
  truncate(
    message: string,
    columns: number,
    options?: { position?: 'start' | 'middle' | 'end' },
  ): string {
    return cliTruncate(message, columns, options);
  }

  /**
   * Wrap a string that may contain ANSI characters to a specific column width.
   */
  wrap(
    message: string,
    columns: number,
    options?: { hard?: boolean; trim?: boolean; wordWrap?: boolean },
  ): string {
    return wrapAnsi(message, columns, options);
  }
}
