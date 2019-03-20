import ansiEscapes from 'ansi-escapes';
import { mockConsole, mockTool } from '../src/tests';
import Console from '../src/Console';
import Output from '../src/Output';

jest.mock('term-size', () => () => ({ columns: 0, rows: 5 }));

describe('Output', () => {
  let output: Output;
  let cli: Console;

  beforeEach(() => {
    cli = mockConsole(mockTool());
    cli.render = jest.fn();

    output = new Output(cli, () => 'foo\nbar\nbaz');
  });

  describe('constructor()', () => {
    it('errors if renderer is not a function', () => {
      // @ts-ignore Allow invalid type
      expect(() => new Output(cli, 123)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('concurrent()', () => {
    it('marks the output as concurrent', () => {
      expect(output.isConcurrent()).toBe(false);

      output.concurrent();

      expect(output.isConcurrent()).toBe(true);
    });
  });

  describe('enqueue()', () => {
    it('renders the output into the console', () => {
      output.enqueue();

      expect(cli.render).toHaveBeenCalledWith(output);
    });

    it('doesnt render the output into the console if already completed', () => {
      // @ts-ignore Allow private access
      output.state.completed = true;
      output.enqueue();

      expect(cli.render).not.toHaveBeenCalled();
    });

    it('marks the next render as the final one', () => {
      expect(output.isFinal()).toBe(false);

      output.enqueue(true);

      expect(output.isFinal()).toBe(true);
    });

    it('triggers start lifecycle', () => {
      const spy = jest.spyOn(output, 'onStart' as any);

      output.enqueue();

      expect(spy).toHaveBeenCalled();
    });

    it('doesnt trigger start lifecycle when final render', () => {
      const spy = jest.spyOn(output, 'onStart' as any);

      output.enqueue(true);

      expect(spy).not.toHaveBeenCalled();
    });

    it('triggers last lifecycle when marked as final', () => {
      const spy = jest.spyOn(output, 'onLast' as any);

      output.enqueue(true);

      expect(spy).toHaveBeenCalled();
    });

    it('doesnt trigger last lifecycle on normal enqueue', () => {
      const spy = jest.spyOn(output, 'onLast' as any);

      output.enqueue();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('erasePrevious()', () => {
    it('does nothing if no previous content', () => {
      output.erasePrevious();

      expect(cli.out).not.toHaveBeenCalled();
    });

    it('erases previous content based on height', () => {
      output.render();
      output.erasePrevious();

      expect(cli.out).toHaveBeenCalledWith('foo\nbar\nbaz\n');
      expect(cli.out).toHaveBeenCalledWith(ansiEscapes.eraseLines(4));
    });
  });

  describe('render()', () => {
    it('appends a trailing newline if one does not exist', () => {
      output.render();

      expect(cli.out).toHaveBeenCalledWith('foo\nbar\nbaz\n');
    });

    it('doesnt append a trailing newline if one does exist', () => {
      output = new Output(cli, () => 'foo\n');
      output.render();

      expect(cli.out).toHaveBeenCalledWith('foo\n');
    });

    it('sets previous line height if not final', () => {
      output.render();

      // @ts-ignore Allow protected access
      expect(output.previousHeight).toBe(4);
    });

    it('doesnt set previous line height if final', () => {
      output.enqueue(true);
      output.render();

      // @ts-ignore Allow protected access
      expect(output.previousHeight).toBe(0);
    });

    it('sets completed if final', () => {
      output.enqueue(true);
      output.render();

      expect(output.isComplete()).toBe(true);
    });

    it('doesnt set completed if not final', () => {
      output.render();

      expect(output.isComplete()).toBe(false);
    });

    it('truncates output if the height exceeds the terminal size', () => {
      output = new Output(cli, () => '1\n2\n3\n4\n5\n6\n7\n8');
      output.render();

      expect(cli.out).toHaveBeenCalledWith('6\n7\n8\n');
    });

    it('triggers first lifecycle on first render', () => {
      const spy = jest.spyOn(output, 'onFirst' as any);

      output.render();

      expect(spy).toHaveBeenCalled();
    });

    it('doesnt trigger first lifecycle on subsequent renders', () => {
      const spy = jest.spyOn(output, 'onFirst' as any);

      output.render();
      output.render();
      output.render();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('triggers complete lifecycle on last render when marked as final', () => {
      const spy = jest.spyOn(output, 'onComplete' as any);

      output.enqueue(true);
      output.render();

      expect(spy).toHaveBeenCalled();
    });

    it('doesnt trigger complete lifecycle when not final', () => {
      const spy = jest.spyOn(output, 'onComplete' as any);

      output.render();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
