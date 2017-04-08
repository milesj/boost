import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
import Console from '../src/Console';
import TaskResult from '../src/TaskResult';
import { PENDING } from '../src/constants';
import MockRenderer from './__mocks__/Renderer.mock';

jest.mock('readline', () => ({
  createInterface: () => ({
    close() {},
    question() {},
    write() {},
  }),
}));

describe('Pipeline', () => {
  const globals = {
    command: {},
    config: {
      foo: 'bar',
      bar: { qux: 123 },
    },
    package: {},
  };

  let pipeline;

  beforeEach(() => {
    pipeline = new Pipeline('boost', globals);
    pipeline.console = new Console(new MockRenderer(), globals);
  });

  it('inherits both normal config and global config', () => {
    expect(pipeline.config).toEqual(globals.config);
    expect(pipeline.global).toEqual(globals);
  });

  it('instantiates a console', () => {
    expect(pipeline.console).toBeInstanceOf(Console);
  });

  it('closes console connection once ran', async () => {
    const spy = jest.spyOn(pipeline.console, 'close');

    await pipeline.run();

    expect(spy).toBeCalled();
  });

  it('closes console connection if an error occurs', async () => {
    class FailureRoutine extends Routine {
      execute() {
        throw new Error('Oops');
      }
    }

    const spy = jest.spyOn(pipeline.console, 'close');

    try {
      await pipeline.pipe(new FailureRoutine('fail', 'title')).run();
    } catch (error) {
      expect(error).toEqual(new Error('Oops'));
    }

    expect(spy).toBeCalled();
  });

  describe('loadResults()', () => {
    it('returns an array of task results', () => {
      pipeline.pipe(
        new Routine('foo', 'foo'),
        new Routine('bar', 'bar'),
      );

      expect(pipeline.loadResults()).toEqual([
        new TaskResult('foo', PENDING),
        new TaskResult('bar', PENDING),
      ]);
    });
  });
});
