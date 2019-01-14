import exit from 'exit';
import { mockTool, mockRoutine } from '@boost/test-utils';
import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
import Context from '../src/Context';

jest.mock('exit');

describe('Pipeline', () => {
  let pipeline: Pipeline<any, any>;

  beforeEach(() => {
    pipeline = new Pipeline(mockTool(), new Context());
  });

  describe('constructor()', () => {
    it('errors if no tool is passed', () => {
      // @ts-ignore
      expect(() => new Pipeline()).toThrowErrorMatchingSnapshot();
    });

    it('sets the context', () => {
      pipeline = new Pipeline(mockTool(), { foo: 'bar' });

      expect(pipeline.context).toEqual({ foo: 'bar' });
    });

    it('sets default depth to -1', () => {
      pipeline = new Pipeline(mockTool(), { foo: 'bar' });

      expect(pipeline.metadata.depth).toBe(-1);
    });
  });

  describe('run()', () => {
    let stopSpy: jest.Mock;

    beforeEach(() => {
      stopSpy = jest.fn();
      pipeline.tool.console.stop = stopSpy;
    });

    it('starts console with routine', async () => {
      const spy = jest.fn();
      const routine = mockRoutine(pipeline.tool);

      pipeline.tool.console.emit = spy;
      pipeline.pipe(routine);

      await pipeline.run(123);

      expect(spy).toHaveBeenCalledWith('start', [[routine], 123]);
    });

    it('stops the console on success', async () => {
      await pipeline.run();

      expect(stopSpy).toHaveBeenCalledWith();
    });

    it('stops the console on failure', async () => {
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

      expect(stopSpy).toHaveBeenCalledWith(new Error('Oops'));
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('uses exit error code', async () => {
      class ExitRoutine extends Routine<any, any> {
        execute() {
          return this.tool.exit('Forced!', 123);
        }
      }

      try {
        await pipeline.pipe(new ExitRoutine('exit', 'title')).run();
      } catch (error) {
        expect(error).toEqual(new Error('Forced!'));
      }

      expect(stopSpy).toHaveBeenCalledWith(new Error('Forced!'));
      expect(exit).toHaveBeenCalledWith(123);
    });
  });
});
