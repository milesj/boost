/* eslint-disable jest/no-standalone-expect */

import { Predicates } from '@boost/common';
import Context from '../src/Context';
import Routine from '../src/Routine';
import WaterfallPipeline from '../src/WaterfallPipeline';
import WorkUnit from '../src/WorkUnit';
import { Runnable } from '../src/types';

describe('SerialPipeline', () => {
  function log(depth: number, index: number) {
    // console.log(`${depth}:${index}`);
  }

  function testTask(depth: number, index: number) {
    return (ctx: Context, value: string, work: Runnable<string, string>) => {
      log(depth, index);

      if (work instanceof WorkUnit) {
        expect(work.depth).toBe(depth);
        expect(work.index).toBe(index);
      }

      return value;
    };
  }

  class TestHierarchy extends Routine<string, string, { depth: number; index: number }> {
    blueprint({ number }: Predicates) {
      return {
        depth: number(),
        index: number(),
      };
    }

    async execute(ctx: Context, value: string) {
      log(this.depth, this.index);

      expect(this.depth).toBe(this.options.depth);
      expect(this.index).toBe(this.options.index);

      return value;
    }
  }

  it('supports an optional constructor value', () => {
    const pipeline = new WaterfallPipeline(new Context());

    expect(pipeline.value).toBeUndefined();
  });

  it('properly handles a hierarchy', async () => {
    class OneTwo extends Routine<string, string, {}> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: string) {
        log(this.depth, this.index);

        expect(this.depth).toBe(1);
        expect(this.index).toBe(2);

        return this.createWaterfallPipeline(ctx, value)
          .pipe('2:0', testTask(2, 0))
          .pipe('2:1', testTask(2, 1))
          .pipe('2:2', testTask(2, 2))
          .run();
      }
    }

    class ZeroZero extends Routine<string, string, {}> {
      blueprint() {
        return {};
      }

      async execute(ctx: Context, value: string) {
        log(this.depth, this.index);

        expect(this.depth).toBe(0);
        expect(this.index).toBe(0);

        return this.createWaterfallPipeline(ctx, value)
          .pipe(new TestHierarchy('1:0', 'Title', { depth: 1, index: 0 }))
          .pipe(new TestHierarchy('1:1', 'Title', { depth: 1, index: 1 }))
          .pipe(new OneTwo('1:2', 'Title'))
          .pipe(new TestHierarchy('1:3', 'Title', { depth: 1, index: 3 }))
          .run();
      }
    }

    const pipeline = new WaterfallPipeline(new Context(), '')
      .pipe(new ZeroZero('0:0', 'Title'))
      .pipe(new TestHierarchy('0:1', 'Title', { depth: 0, index: 1 }));

    expect(pipeline.depth).toBe(0);

    await pipeline.run();
  });

  it('passes context, value, and options to next pipeline', () => {
    const first = new WaterfallPipeline(new Context(), '', {});
    const second = first.pipe('Test', testTask(0, 1));

    expect(second.context).toBe(first.context);
    expect(second.value).toBe(first.value);
    expect(second.options).toEqual(first.options);
  });
});
