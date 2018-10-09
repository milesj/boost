const { Tool, Pipeline, Routine } = require('../../packages/core/lib');
const { DelayedRoutine } = require('../routines');
const random = require('../random');

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
    appPath: __dirname,
    header: 'Powered by Boost',
  },
  process.argv.slice(2),
);

new Pipeline(tool).pipe(new RoutinePoolRoutine('routine', 'Routine pool')).run();
