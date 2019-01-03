/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import ansiEscapes from 'ansi-escapes';
import Console from '../Console';

export default class Output {
  console: Console;

  content: string = '';

  lastHeight: number = 0;

  constructor(console: Console) {
    this.console = console;
  }

  /**
   * Update the output block with the defined content and render the console.
   * Since an output represents an exact line, or a collection of lines,
   * we must always end with a new line to calculate height correctly.
   */
  update(content: string) {
    this.content = content;

    // Always end with a new line
    if (!this.content.endsWith('\n')) {
      this.content += '\n';
    }

    this.console.render();
  }

  /**
   * Render the content to the console. If this output has previously
   * been rendered, re-render it by erasing previous output.
   */
  render(): string {
    let output = ansiEscapes.eraseLines(this.lastHeight);

    // Count the height of the content without the ANSI escape codes above
    this.lastHeight = this.content.split('\n').length;

    output += this.content;

    return output;
  }
}
