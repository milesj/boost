import mfs from 'mock-fs';
import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
import Tool from '../src/Tool';

describe('Pipeline', () => {
  let tool;
  let pipeline;

  beforeEach(() => {
    mfs({
      'config/boost.json': JSON.stringify({ foo: 'bar' }),
      'package.json': JSON.stringify({ name: 'boost' }),
    });

    tool = new Tool({
      appName: 'boost',
    });

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

  describe('loadTasks()', () => {
    it('returns an array of task results', () => {
      const foo = new Routine('foo', 'foo');
      const bar = new Routine('bar', 'bar');

      pipeline.pipe(foo, bar);

      expect(pipeline.loadTasks()).toEqual([foo, bar]);
    });
  });

  describe('run()', () => {
    it('closes console connection once ran', async () => {
      const spy = jest.spyOn(pipeline.tool, 'closeConsole');

      await pipeline.run();

      expect(spy).toBeCalled();
    });

    it('closes console connection if an error occurs', async () => {
      class FailureRoutine extends Routine {
        execute() {
          throw new Error('Oops');
        }
      }

      const spy = jest.spyOn(pipeline.tool, 'closeConsole');

      try {
        await pipeline.pipe(new FailureRoutine('fail', 'title')).run();
      } catch (error) {
        expect(error).toEqual(new Error('Oops'));
      }

      expect(spy).toBeCalled();
    });
  });
});
