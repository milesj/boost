import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
import Tool from '../src/Tool';

describe('Pipeline', () => {
  let tool;
  let pipeline;

  beforeEach(() => {
    tool = new Tool({
      appName: 'test-boost',
    });
    tool.config = { foo: 'bar' };
    tool.initialized = true; // Avoid loaders

    pipeline = new Pipeline(tool);
  });

  describe('constructor()', () => {
    it('errors if no tool is passed', () => {
      expect(() => new Pipeline()).toThrowError(
        'A build `Tool` instance is required to operate the pipeline.',
      );
    });

    it('sets the context', () => {
      pipeline = new Pipeline(tool, { foo: 'bar' });

      expect(pipeline.context).toEqual({ foo: 'bar' });
    });
  });

  describe('run()', () => {
    it('starts console with routine', async () => {
      const spy = jest.fn();
      const routine = new Routine('key', 'title');

      pipeline.tool.console.emit = spy;
      pipeline.pipe(routine);

      await pipeline.run();

      expect(spy).toHaveBeenCalledWith('start', [[routine]]);
    });

    it('exits the console on success', async () => {
      const spy = jest.fn();

      pipeline.tool.console.exit = spy;

      await pipeline.run();

      expect(spy).toHaveBeenCalledWith(null, 0);
    });

    it('exits the console on failure', async () => {
      class FailureRoutine extends Routine {
        execute() {
          throw new Error('Oops');
        }
      }

      const spy = jest.fn();

      pipeline.tool.console.exit = spy;

      try {
        await pipeline.pipe(new FailureRoutine('fail', 'title')).run();
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toHaveBeenCalledWith(new Error('Oops'), 1);
    });
  });
});
