import Context from '../src/Context';
import Routine from '../src/Routine';
import Task from '../src/Task';
import WaterfallPipeline from '../src/WaterfallPipeline';

describe('SyncPipeline', () => {
  it('supports piping action functions and passing a value between each', async () => {
    const pipeline = new WaterfallPipeline(new Context(), 123)
      .pipe(
        'One',
        (ctx, value) => value * 2,
      )
      .pipe(
        'Two',
        (ctx, value) => String(value),
      )
      .pipe(
        'Three',
        (ctx, value) => [value],
      );

    expect(await pipeline.run()).toEqual(['246']);
  });

  it('supports piping `Task` instances and passing a value between each', async () => {
    const pipeline = new WaterfallPipeline(new Context(), 123)
      .pipe(new Task('One', (ctx, value) => value * 2))
      .pipe(new Task('Two', (ctx, value) => String(value)))
      .pipe(new Task('Three', (ctx, value) => [value]));

    expect(await pipeline.run()).toEqual(['246']);
  });

  it('supports piping `Routine` instances and passing a value between each', async () => {
    class One extends Routine<{}, number, number> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: number) {
        return value * 2;
      }
    }

    class Two extends Routine<{}, number, string> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: number) {
        return String(value);
      }
    }

    class Three extends Routine<{}, string, string[]> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: string) {
        return [value];
      }
    }

    const pipeline = new WaterfallPipeline(new Context(), 123)
      .pipe(new One('one', 'One'))
      .pipe(new Two('two', 'Two'))
      .pipe(new Three('three', 'Three'));

    expect(await pipeline.run()).toEqual(['246']);
  });

  it('can define a custom scope for actions', async () => {
    const scope = { test: true };
    const pipeline = new WaterfallPipeline(new Context(), 123).pipe(
      'Scope',
      function scopeAction(ctx, value) {
        // @ts-ignore Allow this
        expect(this).toBe(scope); // eslint-disable-line babel/no-invalid-this

        return value * 2;
      },
      scope,
    );

    expect(await pipeline.run()).toEqual(246);
  });
});
