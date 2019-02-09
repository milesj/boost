/* eslint-disable no-magic-numbers */

import chalk from 'chalk';
import cliSize from 'term-size';
import optimal, { bool, number, string } from 'optimal';
import Output from '../Output';

const STYLES = {
  bar: ['\u2588', '\u2591'],
  dash: ['=', '-'],
  hash: ['#', '-'],
  pipe: ['|', '-'],
  square: ['\u25A0', ' '],
};

export type ProgressStyle = keyof typeof STYLES;

export interface ProgressState {
  color?: boolean;
  current: number;
  style?: ProgressStyle;
  template?: string;
  total: number;
  transparent?: boolean;
}

export type ProgressRenderer = () => ProgressState;

export default class ProgressOutput extends Output<ProgressRenderer> {
  startTime: number = 0;

  stopTime: number = 0;

  protected onStart() {
    this.concurrent();
  }

  protected onFirst() {
    this.startTime = Date.now();
  }

  protected onLast() {
    this.stopTime = Date.now();
  }

  protected toString(state: ProgressState): string {
    const { color, current, style, template, total, transparent } = optimal(
      state,
      {
        color: bool(),
        current: number()
          .required()
          .gte(0),
        style: string('bar').oneOf(Object.keys(STYLES) as ProgressStyle[]),
        template: string('{percent} [{bar}] {progress}').notEmpty(),
        total: number()
          .required()
          .gt(0),
        transparent: bool(),
      },
      {
        name: 'ProgressOutput',
      },
    );

    // Mark as final for convenience
    if (current >= total) {
      this.markFinal();
    }

    // Compile our template
    const progress = Math.min(Math.max(current / total, 0.0), 1.0);
    const percent = Math.floor(progress * 100);
    const elapsed = Date.now() - this.startTime;
    const eta = percent === 100 ? 0 : elapsed * (total / current - 1);
    const rate = current / (elapsed / 1000);
    const partialTemplate = template
      .replace('{progress}', `${current}/${total}`)
      .replace('{current}', String(current))
      .replace('{elapsed}', (elapsed / 1000).toFixed(1))
      .replace('{eta}', (eta / 1000).toFixed(1))
      .replace('{percent}', `${percent.toFixed(0)}%`)
      .replace('{rate}', String(Math.round(rate)))
      .replace('{total}', String(total));

    // Render the progress bar
    const currentWidth = partialTemplate.replace('{bar}', '').length;
    const remainingWidth = cliSize().columns - currentWidth;
    const completed = Math.round(remainingWidth * progress);
    const [complete, incomplete] = STYLES[style];
    let bar = [
      complete.repeat(Math.max(0, completed)),
      (transparent ? ' ' : incomplete).repeat(Math.max(0, remainingWidth - completed)),
    ].join('');

    if (color) {
      if (percent === 100) {
        bar = chalk.green(bar);
      } else if (percent > 50) {
        bar = chalk.yellow(bar);
      } else {
        bar = chalk.red(bar);
      }
    }

    return partialTemplate.replace('{bar}', bar);
  }
}
