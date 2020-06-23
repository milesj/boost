import Context from '../src/Context';
import Routine from '../src/Routine';
import Task from '../src/Task';
import PooledPipeline from '../src/PooledPipeline';
import { AggregatedResult } from '../src/types';
import PipelineError from '../lib/PipelineError';

describe('PooledPipeline', () => {
  function sortAggregated(result: AggregatedResult<unknown>) {
    result.errors.sort();
    result.results.sort();

    return result;
  }

  const expectedResult = {
    errors: [],
    results: ['FOO', 'bar', 'BAZ'].sort(),
  };

  it('supports piping action functions and passing a value to each', async () => {
    const pipeline = new PooledPipeline(new Context(), 'foo')
      .add('One', (ctx, value) => value.toUpperCase())
      .add('Two', () => 'bar')
      .add('Three', () => 'BAZ');

    expect(sortAggregated(await pipeline.run())).toEqual(expectedResult);
  });

  it('supports piping `Task` instances and passing a value to each', async () => {
    const pipeline = new PooledPipeline(new Context(), 'foo')
      .add(new Task('One', (ctx, value) => value.toUpperCase()))
      .add(new Task('Two', () => 'bar'))
      .add(new Task('Three', () => 'BAZ'));

    expect(sortAggregated(await pipeline.run())).toEqual(expectedResult);
  });

  it('supports piping `Routine` instances and passing a value to each', async () => {
    class One extends Routine<string, string, {}> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: string) {
        return value.toUpperCase();
      }
    }

    class Two extends Routine<string, string, {}> {
      blueprint() {
        return {};
      }

      async execute() {
        return 'bar';
      }
    }

    class Three extends Routine<string, string, {}> {
      blueprint() {
        return {};
      }

      async execute() {
        return 'BAZ';
      }
    }

    const pipeline = new PooledPipeline(new Context(), 'foo')
      .add(new One('one', 'One'))
      .add(new Two('two', 'Two'))
      .add(new Three('three', 'Three'));

    expect(sortAggregated(await pipeline.run())).toEqual(expectedResult);
  });

  it('can define a custom scope for actions', async () => {
    const scope = { test: true };
    const pipeline = new PooledPipeline(new Context(), 'foo').add(
      'Scope',
      function scopeAction() {
        // @ts-expect-error
        expect(this).toBe(scope); // eslint-disable-line babel/no-invalid-this

        return 'bar';
      },
      scope,
    );

    expect(await pipeline.run()).toEqual({ errors: [], results: ['bar'] });
  });

  it('emits `onRun` and `onFinish`', async () => {
    const action = (ctx: Context, value: string) => value;
    const pipeline = new PooledPipeline(new Context(), 'abc')
      .add(new Task('One', action))
      .add(new Task('Two', action))
      .add(new Task('Three', action));
    const runSpy = jest.fn();
    const finSpy = jest.fn();

    pipeline.onBeforeRun.listen(runSpy);
    pipeline.onAfterRun.listen(finSpy);

    await pipeline.run();

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(runSpy).toHaveBeenCalledWith('abc');
    expect(finSpy).toHaveBeenCalledTimes(1);
  });

  it('emits `onRunWorkUnit` for each work unit', async () => {
    const one = new Task('One', (ctx, value: string) => value.repeat(1));
    const two = new Task('Two', (ctx, value: string) => value.repeat(2));
    const three = new Task('Three', (ctx, value: string) => value.repeat(3));
    const pipeline = new PooledPipeline(new Context(), 'o').add(one).add(two).add(three);
    const spy = jest.fn();

    pipeline.onRunWorkUnit.listen(spy);

    const result = await pipeline.run();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(one, 'o');
    expect(spy).toHaveBeenCalledWith(two, 'o');
    expect(spy).toHaveBeenCalledWith(three, 'o');
    expect(sortAggregated(result)).toEqual({ errors: [], results: ['o', 'oo', 'ooo'].sort() });
  });

  it('doesnt abort the pipeline if a work unit throws an error', async () => {
    const pipeline = new PooledPipeline(new Context(), '')
      .add('One', () => 'foo')
      .add('Two', () => {
        throw new Error('Oops');
      })
      .add('Three', () => 'bar');

    try {
      expect(sortAggregated(await pipeline.run())).toEqual({
        errors: [new Error('Oops')],
        results: ['bar', 'foo'],
      });
    } catch {
      expect(1).toBe(2);
    }
  });

  it('resolves an empty result when no work units are defined', async () => {
    const pipeline = new PooledPipeline(new Context(), '');

    expect(sortAggregated(await pipeline.run())).toEqual({
      errors: [],
      results: [],
    });
  });

  describe('order', () => {
    it('processes in `fifo` by default', async () => {
      const pipeline = new PooledPipeline(new Context(), '', { concurrency: 1 })
        .add('One', () => 'foo')
        .add('Two', () => 'bar')
        .add('Three', () => 'baz');

      expect(await pipeline.run()).toEqual({
        errors: [],
        results: ['foo', 'bar', 'baz'],
      });
    });

    it('processes in `filo` when enabled', async () => {
      const pipeline = new PooledPipeline(new Context(), '', { concurrency: 1, filo: true })
        .add('One', () => 'foo')
        .add('Two', () => 'bar')
        .add('Three', () => 'baz');

      expect(await pipeline.run()).toEqual({
        errors: [],
        results: ['baz', 'bar', 'foo'],
      });
    });
  });

  describe('timeout', () => {
    it('times out individual work units that are taking too long', async () => {
      const pipeline = new PooledPipeline(new Context(), '', { timeout: 500 })
        .add('One', () => 'foo')
        .add(
          'Two',
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve('bar');
              }, 1000);
            }),
        )
        .add('Three', () => 'baz');

      expect(sortAggregated(await pipeline.run())).toEqual({
        errors: [new PipelineError('WORK_TIME_OUT')],
        results: ['baz', 'foo'],
      });
    });
  });
});
