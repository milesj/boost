import execa from 'execa';
import { Predicates } from '@boost/common';
import Routine from '../src/Routine';
import Context from '../src/Context';
import AggregatedPipeline from '../src/AggregatedPipeline';
import ConcurrentPipeline from '../src/ConcurrentPipeline';
import PooledPipeline from '../src/PooledPipeline';
import WaterfallPipeline from '../src/WaterfallPipeline';
import Task from '../src/Task';
import { STATUS_RUNNING } from '../src/constants';

jest.mock('execa');

describe('Routine', () => {
  class TestRoutine extends Routine<{ test: number }, any, any> {
    blueprint({ number }: Predicates) {
      return {
        test: number(),
      };
    }

    async execute() {
      return null;
    }
  }

  let routine: TestRoutine;

  beforeEach(() => {
    routine = new TestRoutine('key', 'title');
  });

  it('errors if no key is provided', () => {
    expect(() => new TestRoutine('', 'title')).toThrowErrorMatchingSnapshot();
  });

  it('errors if key is not a string', () => {
    expect(
      () =>
        new TestRoutine(
          // @ts-ignore Allow invalid type
          123,
          'title',
        ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('inherits options', () => {
    routine = new TestRoutine('key', 'title', { test: 123 });

    expect(routine.options).toEqual({ test: 123 });
  });

  it('creates an returns an `AggregatedPipeline`', () => {
    const context = new Context();
    const pipeline = routine.createAggregatedPipeline(context, 123);

    expect(pipeline).toBeInstanceOf(AggregatedPipeline);
    expect(pipeline.context).toBe(context);
    expect(pipeline.value).toBe(123);
  });

  it('creates an returns an `ConcurrentPipeline`', () => {
    const context = new Context();
    const pipeline = routine.createConcurrentPipeline(context, 123);

    expect(pipeline).toBeInstanceOf(ConcurrentPipeline);
    expect(pipeline.context).toBe(context);
    expect(pipeline.value).toBe(123);
  });

  it('creates an returns an `PooledPipeline`', () => {
    const context = new Context();
    const pipeline = routine.createPooledPipeline(context, 123);

    expect(pipeline).toBeInstanceOf(PooledPipeline);
    expect(pipeline.context).toBe(context);
    expect(pipeline.value).toBe(123);
  });

  it('creates an returns an `WaterfallPipeline`', () => {
    const context = new Context();
    const pipeline = routine.createWaterfallPipeline(context, 123);

    expect(pipeline).toBeInstanceOf(WaterfallPipeline);
    expect(pipeline.context).toBe(context);
    expect(pipeline.value).toBe(123);
  });

  describe('executeCommand()', () => {
    class FakeStream {
      pipe() {
        return this;
      }

      on(event: string, handler: (line: string) => any) {
        handler('Mocked stream line');

        return this;
      }

      toString() {
        return '';
      }
    }

    beforeEach(() => {
      ((execa as unknown) as jest.Mock).mockImplementation((command, args) => ({
        command: `${command} ${args.join(' ')}`,
        stdout: new FakeStream(),
        stderr: new FakeStream(),
      }));
    });

    it('runs a local command', async () => {
      const result = await routine.executeCommand('yarn', ['-v']);

      expect(result).toEqual(expect.objectContaining({ command: 'yarn -v' }));
    });

    it('runs a local command in a shell', async () => {
      const result = await routine.executeCommand('echo', ['boost'], { shell: true });

      expect(execa).toHaveBeenCalledWith('echo', ['boost'], { shell: true });
      expect(result).toEqual(expect.objectContaining({ command: 'echo boost' }));
    });

    it('pipes stdout/stderr to handler', async () => {
      const commandSpy = jest.fn();
      const commandDataSpy = jest.fn();
      const task = new Task('title', () => {});

      // @ts-ignore Allow
      task.status = STATUS_RUNNING;

      routine.onCommand.listen(commandSpy);
      routine.onCommandData.listen(commandDataSpy);

      await routine.executeCommand('yarn', ['-v'], { workUnit: task });

      expect(commandSpy).toHaveBeenCalledWith('yarn');
      expect(commandDataSpy).toHaveBeenCalledWith('yarn', expect.anything());
    });

    it('sets `statusText` and `output` on work unit', async () => {
      const task = new Task('title', () => {});

      // @ts-ignore Allow
      task.status = STATUS_RUNNING;

      await routine.executeCommand('yarn', ['--help'], { workUnit: task });

      expect(task.statusText).toBe('Mocked stream line');
      expect(task.output).toBe('Mocked stream lineMocked stream line');
    });

    it('doesnt set `statusText` or `output` on work unit when not running', async () => {
      const task = new Task('title', () => {});

      await routine.executeCommand('yarn', ['-v'], { workUnit: task });

      expect(task.statusText).toBe('');
      expect(task.output).toBe('');
    });
  });
});
