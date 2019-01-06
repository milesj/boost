/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Console from './Console';

export type Renderer = () => string;

export default class Output {
  protected completed: boolean = false;

  protected console: Console;

  protected final: boolean = false;

  protected previousHeight: number = 0;

  protected renderer: Renderer;

  constructor(cli: Console, renderer: Renderer) {
    if (typeof renderer !== 'function') {
      throw new TypeError('Output renderer must be a function.');
    }

    this.console = cli;
    this.renderer = renderer;
  }

  /**
   * Enqueue a render. Optionally mark the update as the final render.
   */
  enqueue(final: boolean = false): this {
    if (this.isComplete()) {
      return this;
    }

    if (final) {
      this.final = true;
    }

    this.console.render(this);

    return this;
  }

  /**
   * Erase the previous content if it exists.
   */
  erasePrevious(): this {
    if (this.previousHeight > 0) {
      this.console.out(ansiEscapes.eraseLines(this.previousHeight));
    }

    return this;
  }

  /**
   * Return true if the output is complete and fully rendered.
   */
  isComplete(): boolean {
    return this.completed;
  }

  /**
   * Return true if the next render is the final render.
   */
  isFinal(): boolean {
    return this.final;
  }

  /**
   * Render the content to the console and calculate a new height.
   * Since an output represents an exact line, or a collection of lines,
   * we must always end with a new line to calculate height correctly.
   */
  render(): this {
    if (this.isComplete()) {
      return this;
    }

    let content = this.renderer();

    // Always end with a new line
    if (!content.endsWith('\n')) {
      content += '\n';
    }

    // Content cannot be higher than the terminal
    const lines = content.split('\n');
    const maxHeight = cliSize().rows - 1; // Buffer for input line

    if (lines.length >= maxHeight) {
      content = lines.slice(-maxHeight).join('\n');
    }

    // Write output
    this.console.out(content);

    // Mark output as complete if the final render
    if (this.isFinal()) {
      this.completed = true;
      // Otherwise calculate the height of the output
    } else {
      this.previousHeight = lines.length;
    }

    return this;
  }
}
