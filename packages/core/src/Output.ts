import cliSize from 'term-size';
import ansiEscapes from 'ansi-escapes';
import Console from './Console';

export type StringRenderer = () => string;

export interface OutputState {
  completed: boolean;
  concurrent: boolean;
  final: boolean;
  first: boolean;
}

export default class Output<Renderer extends () => any = StringRenderer> {
  protected console: Console;

  protected previousHeight: number = 0;

  protected renderer: Renderer;

  protected state: OutputState = {
    completed: false,
    concurrent: false,
    final: false,
    first: true,
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
      this.markFinal();
    } else {
      this.onStart();
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

    // Mark first render
    if (this.state.first) {
      this.state.first = false;
      this.onFirst();
    }

    let content = this.toString(this.renderer());

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
      this.markComplete();

      // Otherwise calculate the height of the output
    } else {
      this.previousHeight = lines.length;
    }

    return this;
  }

  /**
   * Mark the output as complete.
   */
  protected markComplete() {
    this.state.completed = true;
    this.onComplete();
  }

  /**
   * Mark as the final render.
   */
  protected markFinal() {
    this.state.final = true;
    this.onLast();
  }

  /**
   * Callback fired when output is completed.
   */
  protected onComplete() {}

  /**
   * Callback fired before the first render.
   */
  protected onFirst() {}

  /**
   * Callback fired before the last render.
   */
  protected onLast() {}

  /**
   * Callback fired when the output has been enqueued.
   */
  protected onStart() {}

  /**
   * Convert the renderer output to a string for the console.
   */
  protected toString(output: ReturnType<Renderer>): string {
    return String(output);
  }
}
