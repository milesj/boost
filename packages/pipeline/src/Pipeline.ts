/* eslint-disable */

import Context from './Context';
import Routine from './Routine';
import Task from './Task';
import WorkUnit from './WorkUnit';
import { Action, Runnable } from './types';

class Pipeline<Input = unknown, Ctx extends Context = Context> {
  parent?: Pipeline<any, Ctx>;

  work?: Runnable<Input, any>;

  value?: Input;

  constructor(initialValue?: Input) {
    this.value = initialValue;
  }

  pipe<Output = unknown>(title: string, action: Action<Ctx, Input, Output>): Pipeline<Output, Ctx>;
  pipe<Output = unknown>(workUnit: Runnable<Input, Output>): Pipeline<Output, Ctx>;
  pipe<Output = unknown>(
    titleOrWorkUnit: string | Runnable<Input, Output>,
    action?: Action<Ctx, Input, Output>,
  ): Pipeline<Output, Ctx> {
    if (titleOrWorkUnit instanceof WorkUnit) {
      this.work = titleOrWorkUnit;
    } else if (typeof titleOrWorkUnit === 'string' && typeof action === 'function') {
      this.work = new Task(titleOrWorkUnit, action);
    } else {
      throw new TypeError('Unknown work unit type. Must be a `Routine` or `Task`.');
    }

    const pipeline = new Pipeline<Output, Ctx>();
    pipeline.parent = this;

    return pipeline;
  }

  async run<Result = unknown>(): Promise<Result> {
    return this.value;
  }
}

// Implicit tasks
new Pipeline(0)
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
new Pipeline(0)
  .pipe(new Task('one', (c, n) => n + 123))
  .pipe(new Task('two', (c, n) => String(n)))
  .pipe(new Task('three', (c, s) => s.toUpperCase()))
  .run();

// Routines
class One extends Routine<{}, number, number> {
  blueprint() {
    return {};
  }

  async execute(c: Context, n: number): Promise<number> {
    return n + 123;
  }
}

class Two extends Routine<{}, number, string> {
  blueprint() {
    return {};
  }

  async execute(c: Context, n: number): Promise<string> {
    return String(n);
  }
}

class Three extends Routine<{}, string, string> {
  blueprint() {
    return {};
  }

  async execute(c: Context, s: string): Promise<string> {
    return s.toUpperCase();
  }
}

new Pipeline(0)
  .pipe(new One('one', 'One'))
  .pipe(new Two('two', 'Two'))
  .pipe(new Three('three', 'Three'))
  .run();
