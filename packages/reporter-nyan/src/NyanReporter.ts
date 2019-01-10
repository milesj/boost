/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-magic-numbers */

import { Reporter } from '@boost/core';

// Based on the wonderful reporter found in Mocha
// https://github.com/mochajs/mocha/blob/master/lib/reporters/nyan.js
export default class NyanReporter extends Reporter {
  catWidth: number = 11;

  colorIndex: number = 0;

  rainbows: string[][] = [];

  rainbowColors: number[] = [];

  rainbowWidth: number = 0;

  tick: boolean = false;

  width: number = 0;

  bootstrap() {
    super.bootstrap();

    this.rainbowWidth = this.size().columns * 0.75 - this.catWidth;
    this.rainbowColors = this.generateColors();
    this.rainbows = this.generateRainbows();

    this.console.on('start', this.handleStart);
  }

  handleStart = () => {
    this.createOutput(() => this.renderLines()).enqueue();
  };

  applyColor(text: string): string {
    if (!this.hasColorSupport()) {
      return text;
    }

    const color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];

    this.colorIndex += 1;

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

  generateRainbows(): string[][] {
    const rainbows: string[][] = [];

    for (let i = 0; i < 4; i += 1) {
      const line = [];

      this.colorIndex = 0;

      for (let r = 0; r < this.rainbowWidth; r += 1) {
        line.push(this.applyColor(r % 2 === 0 ? '_' : '-'));
      }

      rainbows.push(line);
    }

    return rainbows;
  }

  getCatFace(): string {
    // if (stats.failures) {
    //   return '( x .x)';
    // } else if (stats.pending) {
    //   return '( o .o)';
    // } else if (stats.passes) {
    //   return '( ^ .^)';
    // }

    return '( - .-)';
  }

  renderLines(): string {
    let output = '';

    // Poptart
    output += this.rainbows[0].join('');
    output += ' ';
    output += ' ,------,\n';

    // Ears
    output += this.rainbows[1].join('');
    output += ' ';
    output += ` |${this.tick ? '  ' : '   '}/\\_/\\\n`;

    // Face
    output += this.rainbows[2].join('');
    output += ' ';

    if (this.tick) {
      output += `~|_${this.getCatFace()}\n`;
    } else {
      output += `^|__${this.getCatFace()}\n`;
    }

    // Feet
    output += this.rainbows[3].join('');
    output += ' ';
    output += `${this.tick ? '  ' : '   '}""  ""\n`;

    return output;
  }
}
