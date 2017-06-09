const Boost = require('../lib/App').default;
const Routine = require('../lib/Routine').default;

class BuildRoutine extends Routine {
  execute(args, context) {
    console.log('EXECUTE', args, context);

    return null;
  }
}

const app = new Boost('publish');

app.command('build [dir...]', 'Build source files')
  .alias('b')
  .option('-f, --force [foo]', 'Force overwrite')
  .option('-m, --minify', 'Minify source code')
  .pipe(new BuildRoutine('build', 'Build source files'));

app.run();
