/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import optimal, { bool, number, string, Struct } from 'optimal';
import { ConsoleInterface } from './Console';
import Module, { ModuleInterface } from './Module';
import { TaskInterface } from './Task';
import themePalettes from './themes';
import { Color, ColorType, ColorPalette } from './types';

export const SLOW_THRESHOLD = 10000; // ms

export interface ReporterOptions extends Struct {
  footer: string;
  silent: boolean;
  slowThreshold: number;
  theme: string;
  verbose: 0 | 1 | 2 | 3;
}

export interface ReporterInterface<T = any> extends ModuleInterface {
  console: ConsoleInterface;
  lines: T[];
  bootstrap(): void;
}

export default class Reporter<T, To extends ReporterOptions> extends Module<To>
  implements ReporterInterface {
  // @ts-ignore Set after instantiation
  console: ConsoleInterface;

  lines: T[] = [];

  options: To;

  startTime: number = 0;

  stopTime: number = 0;

  constructor(options: Partial<To> = {}) {
    super(options);

    this.options = optimal(
      options,
      {
        footer: string().empty(),
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
  }

  /**
   * Register console listeners.
   */
  bootstrap() {
    this.console.on('start', this.handleBaseStart).on('stop', this.handleBaseStop);
  }

  /**
   * Add a line to be rendered.
   */
  addLine(line: T): this {
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
          .join('\n'),
      );

      this.console.write(`${stack}\n`);
    }

    this.console.write('\n');
  }

  /**
   * Display a footer after all other output.
   */
  displayFooter() {
    const { footer } = this.options;
    const time = this.getElapsedTime(this.startTime, this.stopTime, false);

    if (footer) {
      this.console.write(`${footer} ${this.style(`(${time})`)}\n`);
    } else {
      this.console.write(this.style(`Ran in ${time}\n`));
    }
  }

  /**
   * Find a line using a callback
   */
  findLine(callback: (item: T) => boolean): T | undefined {
    return this.lines.find(line => callback(line));
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
   * Calculate the elapsed time and highlight as red if over the threshold.
   */
  getElapsedTime(start: number, stop: number = 0, highlight: boolean = true): string {
    const time = (stop || Date.now()) - start;
    const isSlow = time > this.options.slowThreshold;
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
  removeLine(callback: (item: T) => boolean): this {
    this.lines = this.lines.filter(line => !callback(line));

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
}
