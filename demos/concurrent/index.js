const { string } = require('optimal');
const { Tool, Pipeline, Routine, Reporter } = require('../../packages/core/lib');
const { DelayedRoutine } = require('../routines');

class ConcurrentReporter extends Reporter {
  blueprint() {
    return {
      char: string(),
    };
  }

  bootstrap() {
    super.bootstrap();

    this.handleRoutine = this.handleRoutine.bind(this);

    this.console.on('routine', this.handleRoutine);
  }

  handleRoutine(routine) {
    if (routine.metadata.depth !== 0) {
      return;
    }

    const output = this.createConcurrentOutput(() => {
      output.current = (output.current || '') + this.options.char;

      return this.truncate(output.current);
    }).enqueue();

    const handler = () => {
      output.enqueue(true);
    };

    routine.on('skip', handler);
    routine.on('pass', handler);
    routine.on('fail', handler);
  }
}

class ConcurentOutputRoutine extends Routine {
  bootstrap() {
    this.pipe(new DelayedRoutine('long', 'Routine with a long run time', { delay: 5000 }));
  }

  execute() {
    return this.serializeRoutines(null);
  }
}

const tool = new Tool(
  {
    appName: 'demos-concurrent',
    appPath: __dirname,
  },
  process.argv.slice(2),
);

tool.addPlugin('reporter', new ConcurrentReporter({ char: '#' }));
tool.addPlugin('reporter', new ConcurrentReporter({ char: '@' }));

new Pipeline(tool)
  .pipe(new ConcurentOutputRoutine('concurrent', 'Routine with muliple outputs'))
  .run();
