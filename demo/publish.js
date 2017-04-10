import App from '../src/App';

const app = new App('boost', {})
  .command('build', (command) => {
    command
      .alias('b')
      .description('Build source files')
      .option('-f, --force', 'Force overwrite')
      .option('-m, --minify', 'Minify source code');

    console.log(command);
  })
  .run();

console.log(app);
