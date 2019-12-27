/* eslint-disable no-magic-numbers */

import optimal, { bool, number, string } from 'optimal';
import { formatMs } from '@boost/common';
import { screen, style } from '@boost/terminal';
import Output from '../Output';

const STYLES = {
  bar: ['\u2588', '\u2591'],
  classic: ['=', '-'],
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
    const { color, current, style: styleName, template, total, transparent } = optimal(
      state,
      {
        color: bool(),
        current: number()
          .required()
          .gte(0),
        style: string('bar').oneOf(Object.keys(STYLES) as ProgressStyle[]),
        template: string('{percent} {bar} {progress}').notEmpty(),
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
    const progress = Math.min(Math.max(current / total, 0), 1);
    const percent = Math.floor(progress * 100);
    const elapsed = Date.now() - this.startTime;
    const estimated = percent === 100 ? 0 : elapsed * (total / current - 1);
    const rate = current / (elapsed / 1000);
    const partialTemplate = template
      .replace('{progress}', `${current}/${total}`)
      .replace('{current}', String(current))
      .replace('{elapsed}', formatMs(elapsed))
      .replace('{estimated}', formatMs(estimated))
      .replace('{percent}', `${percent.toFixed(0)}%`)
      .replace('{rate}', String(rate.toFixed(2)))
      .replace('{total}', String(total));

    // Render the progress bar
    const currentWidth = partialTemplate.replace('{bar}', '').length;
    const remainingWidth = screen.size().columns - currentWidth;
    const completed = Math.round(remainingWidth * progress);
    const [complete, incomplete] = STYLES[styleName];
    let bar = [
      complete.repeat(Math.max(0, completed)),
      (transparent ? ' ' : incomplete).repeat(Math.max(0, remainingWidth - completed)),
    ].join('');

    if (color) {
      if (percent >= 90) {
        bar = style.green(bar);
      } else if (percent >= 45) {
        bar = style.yellow(bar);
      } else {
        bar = style.red(bar);
      }
    }

    return partialTemplate.replace('{bar}', bar);
  }
}
