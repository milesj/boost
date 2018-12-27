/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import ansiEscapes from 'ansi-escapes';

export default class Output {
  protected completed: boolean = false;

  protected content: string = '';

  protected lastHeight: number = 0;

  constructor(content: string) {
    this.update(content);
  }

  isComplete(): boolean {
    return this.completed;
  }

  update(content: string) {
    this.content = content;
  }

  render(): string {
    const output = ansiEscapes.eraseLines(this.lastHeight) + this.content;

    this.lastHeight = this.content.split('\n').length;

    return output;
  }
}
