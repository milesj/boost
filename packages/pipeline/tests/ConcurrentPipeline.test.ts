import Context from '../src/Context';
import Routine from '../src/Routine';
import Task from '../src/Task';
import ConcurrentPipeline from '../src/ConcurrentPipeline';

describe('ConcurrentPipeline', () => {
  it('supports piping action functions and passing a value to each', async () => {
    const pipeline = new ConcurrentPipeline(new Context(), 'foo')
      .add('One', (ctx, value) => value.toUpperCase())
      .add('Two', () => 'bar')
      .add('Three', () => 'BAZ');

    expect((await pipeline.run()).sort()).toEqual(['FOO', 'bar', 'BAZ'].sort());
  });

  it('supports piping `Task` instances and passing a value to each', async () => {
    const pipeline = new ConcurrentPipeline(new Context(), 'foo')
      .add(new Task('One', (ctx, value) => value.toUpperCase()))
      .add(new Task('Two', () => 'bar'))
      .add(new Task('Three', () => 'BAZ'));

    expect((await pipeline.run()).sort()).toEqual(['FOO', 'bar', 'BAZ'].sort());
  });

  it('supports piping `Routine` instances and passing a value to each', async () => {
    class One extends Routine<{}, string, string> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: string) {
        return value.toUpperCase();
      }
    }

    class Two extends Routine<{}, string, string> {
      blueprint() {
        return {};
      }

      async execute() {
        return 'bar';
      }
    }

    class Three extends Routine<{}, string, string> {
      blueprint() {
        return {};
      }

      async execute() {
        return 'BAZ';
      }
    }

    const pipeline = new ConcurrentPipeline(new Context(), 'foo')
      .add(new One('one', 'One'))
      .add(new Two('two', 'Two'))
      .add(new Three('three', 'Three'));

    expect((await pipeline.run()).sort()).toEqual(['FOO', 'bar', 'BAZ'].sort());
  });

  it('can define a custom scope for actions', async () => {
    const scope = { test: true };
    const pipeline = new ConcurrentPipeline(new Context(), 'foo').add(
      'Scope',
      function scopeAction() {
        // @ts-ignore Allow this
        expect(this).toBe(scope); // eslint-disable-line babel/no-invalid-this

        return 'bar';
      },
      scope,
    );

    expect(await pipeline.run()).toEqual(['bar']);
  });

  it('emits `onRun` for each work unit', async () => {
    const action = (ctx: Context, value: string) => value;
    const pipeline = new ConcurrentPipeline(new Context(), 'abc')
      .add(new Task('One', action))
      .add(new Task('Two', action))
      .add(new Task('Three', action));
    const spy = jest.fn();

    pipeline.onRun.listen(spy);

    await pipeline.run();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('abc');
  });

  it('emits `onRunWorkUnit` for each work unit', async () => {
    const one = new Task('One', (ctx, value: string) => value.repeat(1));
    const two = new Task('Two', (ctx, value: string) => value.repeat(2));
    const three = new Task('Three', (ctx, value: string) => value.repeat(3));
    const pipeline = new ConcurrentPipeline(new Context(), 'o')
      .add(one)
      .add(two)
      .add(three);
    const spy = jest.fn();

    pipeline.onRunWorkUnit.listen(spy);

    const result = await pipeline.run();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(one, 'o');
    expect(spy).toHaveBeenCalledWith(two, 'o');
    expect(spy).toHaveBeenCalledWith(three, 'o');
    expect(result.sort()).toEqual(['o', 'oo', 'ooo'].sort());
  });

  it('aborts the pipeline if a work unit throws an error', async () => {
    const pipeline = new ConcurrentPipeline(new Context(), '')
      .add('One', () => 'foo')
      .add('Two', () => {
        throw new Error('Oops');
      })
      .add('Three', () => 'bar');

    try {
      await pipeline.run();

      expect(1).toBe(2);
    } catch (error) {
      expect(error).toEqual(new Error('Oops'));
    }
  });
});
