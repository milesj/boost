const Boost = require('../lib/App').default;

const app = new Boost('publish');

app.command('build [dir]', 'Build source files')
  .alias('b')
  .option('-f, --force', 'Force overwrite')
  .option('-m, --minify', 'Minify source code');

app.run();
