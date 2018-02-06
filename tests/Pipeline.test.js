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
      expect(() => new Pipeline())
        .toThrowError('A build `Tool` instance is required to operate the pipeline.');
    });

    it('inherits config from tool', () => {
      expect(pipeline.config).toEqual({ foo: 'bar' });
    });
  });

  describe('run()', () => {
    it('exits the console on success', async () => {
      const spy = jest.spyOn(pipeline.tool.console, 'exit');

      await pipeline.run();

      expect(spy).toBeCalledWith(null, 0);
    });

    it('exits the console on failure', async () => {
      class FailureRoutine extends Routine {
        execute() {
          throw new Error('Oops');
        }
      }

      const spy = jest.spyOn(pipeline.tool.console, 'exit');

      try {
        await pipeline.pipe(new FailureRoutine('fail', 'title')).run();
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toBeCalledWith(new Error('Oops'), 1);
    });
  });
});
