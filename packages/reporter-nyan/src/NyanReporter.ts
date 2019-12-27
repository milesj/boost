/* eslint-disable no-magic-numbers, @typescript-eslint/no-explicit-any */

import { style } from '@boost/terminal';
import { Reporter, Routine, Task } from '@boost/core';

// Based on the wonderful reporter found in Mocha
// https://github.com/mochajs/mocha/blob/master/lib/reporters/nyan.js
export default class NyanReporter extends Reporter {
  activeRoutine: Routine<any, any> | null = null;

  activeTask: Task<any> | null = null;

  catWidth: number = 11;

  colorIndex: number = 0;

  failed: boolean = false;

  rainbows: string[][] = [[], [], [], []];

  rainbowColors: number[] = [];

  rainbowWidth: number = 0;

  tick: 1 | 2 | 3 | 4 = 1;

  blueprint() {
    return {};
  }

  bootstrap() {
    super.bootstrap();

    this.rainbowWidth = this.size().columns - this.catWidth * 2;
    this.rainbowColors = this.generateColors();

    this.console.onStart.listen(this.handleStart);
    this.console.onStop.listen(this.handleStop);
    this.console.onRoutine.listen(this.handleRoutine);
    this.console.onTask.listen(this.handleTask);
  }

  handleStart = () => {
    this.createOutput(() => this.renderLines()).enqueue();
    this.hideCursor();
  };

  handleStop = (error: Error | null) => {
    this.failed = !!error;
    this.showCursor();
  };

  handleRoutine = (routine: Routine<any, any>) => {
    const handler = () => {
      this.activeRoutine = routine;
    };

    routine.onFail.listen(handler);
    routine.onPass.listen(handler);
    handler();
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
      const n = i * (1 / 6);
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

    if (this.failed) {
      eyes = 'x .x';
    }

    return `( ${style.white(eyes)})`;
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

    if (this.tick === 5) {
      this.tick = 1;
    }
  }

  isInterval(): boolean {
    return this.tick >= 3;
  }

  renderLines(): string {
    this.increaseTick();
    this.increaseRainbowWidth();

    const tick = this.isInterval();
    let output = '\n';

    // Poptart
    output += this.rainbows[0].join('');
    output += ' ';
    output += style.magenta(' ,------,');
    output += '\n';

    // Ears
    output += this.rainbows[1].join('');
    output += ' ';
    output += style.magenta(` |${tick ? ' .' : ' . '}`);
    output += style.gray('/\\_/\\');
    output += '\n';

    // Face
    output += this.rainbows[2].join('');
    output += ' ';

    if (tick) {
      output += style.gray('~');
      output += style.magenta('|_');
    } else {
      output += style.gray('^');
      output += style.magenta('|__');
    }

    output += style.gray(this.getCatFace());
    output += '\n';

    // Feet
    output += this.rainbows[3].join('');
    output += ' ';

    if (tick) {
      output += style.gray(' "  ""  "');
    } else {
      output += style.gray('  ""  ""');
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

    line += '\n';
    output += this.truncate(line);

    return output;
  }
}
