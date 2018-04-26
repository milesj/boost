/* eslint-disable no-magic-numbers */

const { Tool, Pipeline, Routine } = require('../../lib');

function random(max = 10, min = 3) {
  return Math.floor(Math.random() * max) + min;
}

class MultiTaskRoutine extends Routine {
  bootstrap() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.task(`Running task #${index}`, this.delayedTask).skip(index % 6 === 0);
    });
  }

  execute() {
    if (this.options.error) {
      throw new Error('Oops!');
    }

    return this.parallelizeTasks();
    // return this.serializeTasks();
  }

  delayedTask() {
    return new Promise(resolve => {
      setTimeout(resolve, random(750, 250));
    });
  }
}

class MultiRoutine extends Routine {
  bootstrap() {
    Array.from({ length: random(1, 3) }, (v, i) => i).forEach(index => {
      this.pipe(new MultiTaskRoutine(`sub${index}`, `Subroutine #${index}`));
    });

    if (this.options.deep) {
      this.pipe(new MultiRoutine('deepsub', 'Deeply nested sub-routine'));
    }
  }

  execute() {
    return this.serializeSubroutines();
  }
}

const tool = new Tool(
  {
    appName: 'demos-reporter',
    // footer: 'Powered by Boost',
  },
  process.argv.slice(2),
);

new Pipeline(tool)
  .pipe(new MultiTaskRoutine('multiple', 'Multi-task routine #1'))
  // .pipe(new MultiTaskRoutine('error', 'Routine that will fail', { error: true }))
  .pipe(new MultiTaskRoutine('skipped', 'Multi-task routine #2').skip(true))
  .pipe(new MultiRoutine('subs', 'Multi-subroutines', { deep: true }))
  // .pipe(new MultiTaskRoutine('again', 'Multi-task routine #3'))
  .run({});
