/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Console from './Console';

export type Renderer = () => string;

export interface OutputState {
  completed: boolean;
  concurrent: boolean;
  final: boolean;
}

export default class Output {
  protected console: Console;

  protected previousHeight: number = 0;

  protected renderer: Renderer;

  protected state: OutputState = {
    completed: false,
    concurrent: false,
    final: false,
  };

  constructor(cli: Console, renderer: Renderer) {
    if (typeof renderer !== 'function') {
      throw new TypeError('Output renderer must be a function.');
    }

    this.console = cli;
    this.renderer = renderer;
  }

  /**
   * Mark the output as concurrent to be rendered at the same time as other output.
   */
  concurrent(): this {
    this.state.concurrent = true;

    return this;
  }

  /**
   * Enqueue a render. Optionally mark the update as the final render.
   */
  enqueue(final: boolean = false): this {
    if (this.isComplete()) {
      return this;
    }

    if (final) {
      this.state.final = true;
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
    return this.state.completed;
  }

  /**
   * Return true if the output should be rendered concurrently.
   */
  isConcurrent(): boolean {
    return this.state.concurrent;
  }

  /**
   * Return true if the next render is the final render.
   */
  isFinal(): boolean {
    return this.state.final;
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
      this.state.completed = true;
      // Otherwise calculate the height of the output
    } else {
      this.previousHeight = lines.length;
    }

    return this;
  }
}
