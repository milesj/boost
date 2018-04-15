/* eslint-disable no-magic-numbers */

const { Tool, Pipeline, Routine } = require('../../lib');

function random(max = 15, min = 5) {
  return Math.floor(Math.random() * max) + min;
}

class MultiTaskRoutine extends Routine {
  execute() {
    Array.from({ length: random() }, (v, i) => i).forEach(index => {
      this.task(`Running task #${index}`, this.delayedTask);
    });

    return this.serializeTasks();
  }

  delayedTask() {
    return new Promise(resolve => {
      setTimeout(resolve, random(1000, 250));
    });
  }
}

const tool = new Tool(
  {
    appName: 'demos-reporter',
  },
  process.argv.slice(2),
);

new Pipeline(tool)
  .pipe(new MultiTaskRoutine('multi1', 'Multi-task routine #1'))
  .pipe(new MultiTaskRoutine('multi2', 'Multi-task routine #2'))
  .run({});
