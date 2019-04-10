const { Tool, Pipeline, Routine, Reporter } = require('../../packages/core/lib');
const { DelayedRoutine } = require('../routines');

class ProgressReporter extends Reporter {
  bootstrap() {
    super.bootstrap();

    this.handleStart = this.handleStart.bind(this);

    this.console.onStart.listen(this.handleStart);
  }

  handleStart(parents) {
    const total = parents[0].routines.length;
    const getCurrent = () => parents[0].routines.filter(routine => routine.isComplete()).length;

    // Default
    this.createProgressOutput(() => ({
      current: getCurrent(),
      total,
    })).enqueue();

    // With rate and color
    this.createProgressOutput(() => ({
      color: true,
      current: getCurrent(),
      style: 'square',
      template: 'Downloading... {bar} {percent} @ {rate} mb/s',
      total,
      transparent: true,
    })).enqueue();

    // With ETA and elapsed
    this.createProgressOutput(() => ({
      current: getCurrent(),
      style: 'pipe',
      template: '[{bar}] | {elapsed} elapsed | {estimated} estimated',
      total,
    })).enqueue();

    // With minimal color
    this.createProgressOutput(() => ({
      color: true,
      current: getCurrent(),
      style: 'hash',
      template: '{bar}',
      total,
    })).enqueue();
  }
}

class RoutineProgressRoutine extends Routine {
  bootstrap() {
    Array.from({ length: 25 }, (v, i) => i).forEach(index => {
      this.pipe(new DelayedRoutine(`${index}`, `Routine #${index}`));
    });
  }

  execute() {
    return this.poolRoutines(null);
  }
}

const tool = new Tool(
  {
    appName: 'demos-progress',
    appPath: __dirname,
  },
  process.argv.slice(2),
);

tool.addPlugin('reporter', new ProgressReporter());

new Pipeline(tool)
  .pipe(new RoutineProgressRoutine('progress', 'Routine pool with progress bar'))
  .run();
