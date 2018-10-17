import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
import { createTestTool, createTestRoutine } from './helpers';
import Context from '../src/Context';

describe('Pipeline', () => {
  let pipeline: Pipeline<any, any>;

  beforeEach(() => {
    pipeline = new Pipeline(createTestTool(), new Context());
  });

  describe('constructor()', () => {
    it('errors if no tool is passed', () => {
      // @ts-ignore
      expect(() => new Pipeline()).toThrowErrorMatchingSnapshot();
    });

    it('sets the context', () => {
      pipeline = new Pipeline(createTestTool(), { foo: 'bar' });

      expect(pipeline.context).toEqual({ foo: 'bar' });
    });
  });

  describe('run()', () => {
    let exitSpy: jest.Mock;

    beforeEach(() => {
      exitSpy = jest.fn();
      pipeline.tool.console.exit = exitSpy;
    });

    it('starts console with routine', async () => {
      const spy = jest.fn();
      const routine = createTestRoutine(pipeline.tool);

      pipeline.tool.console.emit = spy;
      pipeline.pipe(routine);

      await pipeline.run();

      expect(spy).toHaveBeenCalledWith('start', [[routine]]);
    });

    it('exits the console on success', async () => {
      await pipeline.run();

      expect(exitSpy).toHaveBeenCalledWith(null, 0);
    });

    it('exits the console on failure', async () => {
      class FailureRoutine extends Routine<any, any> {
        execute() {
          return Promise.reject(new Error('Oops'));
        }
      }

      try {
        await pipeline.pipe(new FailureRoutine('fail', 'title')).run();
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(exitSpy).toHaveBeenCalledWith(new Error('Oops'), 1);
    });
  });
});
