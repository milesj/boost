/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import Console from './Console';
import ModuleLoader from './ModuleLoader';
import Plugin from './Plugin';
import Task from './Task';
import { Color, ColorType, ColorPalette } from './types';

export const SLOW_THRESHOLD = 10000; // ms
export const OUTPUT_COMPACT = 1;
export const OUTPUT_NORMAL = 2;
export const OUTPUT_VERBOSE = 3;

export default class Reporter<Options = {}> extends Plugin<Options> {
  // @ts-ignore Set after instantiation
  console: Console;

  startTime: number = 0;

  stopTime: number = 0;

  /**
   * Register console listeners.
   */
  bootstrap() {
    this.console.on('start', this.handleBaseStart).on('stop', this.handleBaseStop);
  }

  /**
   * Calculate the current number of tasks that have completed.
   */
  calculateTaskCompletion(tasks: Task<any>[]): number {
    return tasks.reduce((sum, task) => (task.hasPassed() || task.isSkipped() ? sum + 1 : sum), 0);
  }

  /**
   * Display an error and it's stack.
   */
  displayError(error: Error): void {
    this.console.err(`\n${this.style(error.message, 'failure', ['bold'])}\n`);

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

      this.console.err(stack, 1);
    }

    this.console.err('\n');
  }

  /**
   * Return specific colors based on chosen theme.
   */
  getColorPalette(): ColorPalette {
    const { theme } = this.tool.config;
    const palette =
      chalk.level >= 2 && theme !== 'default'
        ? new ModuleLoader<ColorPalette>(this.tool, 'theme', null, true).loadModule(theme)
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
    return length <= 0 ? '' : ' '.repeat(length);
  }

  /**
   * Return true if output level is compact (1).
   */
  isCompactOutput(): boolean {
    return this.tool.config.output === OUTPUT_COMPACT;
  }

  /**
   * Return true if output level is normal (2).
   */
  isNormalOutput(): boolean {
    return this.tool.config.output === OUTPUT_NORMAL;
  }

  /**
   * Return true if the there should be no output.
   */
  isSilent(): boolean {
    return this.console.isSilent();
  }

  /**
   * Return true if output level is verbose (3).
   */
  isVerboseOutput(): boolean {
    return this.tool.config.output === OUTPUT_VERBOSE;
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
}
