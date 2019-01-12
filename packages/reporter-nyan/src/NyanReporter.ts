/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-magic-numbers */

import chalk from 'chalk';
import { Reporter, Routine, Task } from '@boost/core';

// Based on the wonderful reporter found in Mocha
// https://github.com/mochajs/mocha/blob/master/lib/reporters/nyan.js
export default class NyanReporter extends Reporter {
  activeRoutine: Routine<any, any> | null = null;

  activeTask: Task<any> | null = null;

  catWidth: number = 11;

  colorIndex: number = 0;

  rainbows: string[][] = [[], [], [], []];

  rainbowColors: number[] = [];

  rainbowWidth: number = 0;

  tick: number = 0;

  width: number = 0;

  bootstrap() {
    super.bootstrap();

    this.rainbowWidth = this.size().columns - this.catWidth * 2;
    this.rainbowColors = this.generateColors();

    this.console
      .on('start', this.handleStart)
      .on('routine', this.handleRoutine)
      .on('routine.pass', this.handleRoutine)
      .on('routine.fail', this.handleRoutine)
      .on('task', this.handleTask);
  }

  handleStart = () => {
    this.createOutput(() => this.renderLines()).enqueue();
  };

  handleRoutine = (routine: Routine<any, any>) => {
    this.activeRoutine = routine;
  };

  handleTask = (task: Task<any>) => {
    this.activeTask = task;
  };

  applyColor(text: string): string {
    if (!this.hasColorSupport()) {
      return text;
    }

    const color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];

    // eslint-disable-next-line unicorn/escape-case
    return `\u001b[38;5;${color}m${text}\u001b[0m`;
  }

  generateColors(): number[] {
    const colors: number[] = [];

    for (let i = 0; i < 6 * 7; i += 1) {
      const pi3 = Math.floor(Math.PI / 3);
      const n = i * (1.0 / 6);
      const r = Math.floor(3 * Math.sin(n) + 3);
      const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
      const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);

      colors.push(36 * r + 6 * g + b + 16);
    }

    return colors;
  }

  getCatFace(): string {
    const routine = this.activeRoutine;
    let eyes = '- .-';

    if (routine) {
      if (routine.hasFailed()) {
        eyes = 'x .x';
      } else if (routine.isSkipped() || routine.isPending()) {
        eyes = 'o .o';
      } else if (routine.hasPassed()) {
        eyes = '^ .^';
      }
    }

    return `( ${chalk.white(eyes)})`;
  }

  increaseRainbowWidth() {
    for (let i = 0; i < 4; i += 1) {
      const line = this.rainbows[i];

      if (line.length >= this.rainbowWidth) {
        line.shift();
      }

      line.push(this.applyColor(this.isInterval() ? '_' : '-'));

      this.rainbows[i] = line;
    }

    this.colorIndex += 1;
  }

  increaseTick() {
    this.tick += 1;

    if (this.tick === 100) {
      this.tick = 0;
    }
  }

  isInterval(long: boolean = false): boolean {
    return this.tick % (long ? 4 : 2) === 0;
  }

  renderLines(): string {
    this.increaseTick();
    this.increaseRainbowWidth();

    const tick = this.isInterval(true);
    let output = '';

    // Poptart
    output += this.rainbows[0].join('');
    output += ' ';
    output += chalk.magenta(' ,------,');
    output += '\n';

    // Ears
    output += this.rainbows[1].join('');
    output += ' ';
    output += chalk.magenta(` |${tick ? ' .' : ' . '}`);
    output += chalk.gray('/\\_/\\');
    output += '\n';

    // Face
    output += this.rainbows[2].join('');
    output += ' ';

    if (tick) {
      output += chalk.gray('~');
      output += chalk.magenta('|_');
    } else {
      output += chalk.gray('^');
      output += chalk.magenta('|__');
    }

    output += chalk.gray(this.getCatFace());
    output += '\n';

    // Feet
    output += this.rainbows[3].join('');
    output += ' ';

    if (tick) {
      output += chalk.gray(' " "  ""');
    } else {
      output += chalk.gray('  ""  " "');
    }

    output += '\n';

    if (this.isFinalRender()) {
      return output;
    }

    // Routine
    const routine = this.activeRoutine;
    const task = this.activeTask;
    let line = '\n';

    if (routine) {
      line += this.style(routine.key.toUpperCase(), this.getColorType(routine), ['bold']);
      line += ' ';
      line += routine.title;
    }

    if (task) {
      line += ' ';
      line += this.style(task.statusText || task.title, 'pending');
    }

    output += this.truncate(line);

    return output;
  }
}
