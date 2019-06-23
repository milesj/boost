/* eslint-disable no-magic-numbers, lines-between-class-members, no-dupe-class-members */

import Context from './Context';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { Action, Runnable } from './types';

class Pipeline<Ctx extends Context, Input = unknown> {
  parent?: Pipeline<Ctx, any>;

  work?: Runnable<Input, any>;

  pipe<Output = unknown>(title: string, action: Action<Ctx, Input, Output>): Pipeline<Ctx, Output>;
  pipe<Output = unknown>(workUnit: Runnable<Input, Output>): Pipeline<Ctx, Output>;
  pipe<Output = unknown>(
    titleOrWorkUnit: string | Runnable<Input, Output>,
    action?: Action<Ctx, Input, Output>,
  ): Pipeline<Ctx, Output> {
    if (titleOrWorkUnit instanceof WorkUnit) {
      this.work = titleOrWorkUnit;
    } else if (typeof titleOrWorkUnit === 'string' && typeof action === 'function') {
      this.work = new Task(titleOrWorkUnit, action);
    } else {
      throw new TypeError('Unknown work unit type. Must be a `Routine` or `Task`.');
    }

    const pipeline = new Pipeline<Ctx, Output>();
    pipeline.parent = this;

    return pipeline;
  }

  run<Result = unknown>(): Result {
    return '';
  }
}

// Implicit tasks
new Pipeline<Context, number>()
  .pipe(
    'one',
    (c, n) => n + 123,
  )
  .pipe(
    'two',
    (c, n) => String(n),
  )
  .pipe(
    'three',
    (c, s) => s.toUpperCase(),
  )
  .run();

// Explicit tasks
new Pipeline<Context, number>()
  .pipe(new Task('one', (c, n) => n + 123))
  .pipe(new Task('two', (c, n) => String(n)))
  .pipe(new Task('three', (c, s) => s.toUpperCase()))
  .run();
