const { Tool, Pipeline, Routine, TaskPool } = require('../../lib');
const random = require('../random');

class DelayedRoutine extends Routine {
  execute() {
    return new Promise(resolve => {
      setTimeout(resolve, random(2000, 1000));
    });
  }
}

class RoutinePoolRoutine extends Routine {
  bootstrap() {
    Array.from({ length: random(25, 5) }, (v, i) => i).forEach(index => {
      this.pipe(new DelayedRoutine(`${index}`, `Routine #${index}`));
    });
  }

  execute() {
    return this.poolRoutines(null);
  }
}

const tool = new Tool(
  {
    appName: 'demos-pool',
  },
  process.argv.slice(2),
);

new Pipeline(tool).pipe(new RoutinePoolRoutine('routine', 'Routine pool')).run();
