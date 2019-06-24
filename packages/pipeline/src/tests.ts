/* eslint-disable */

import Context from './Context';
import Routine from './Routine';
import Task from './Task';

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
