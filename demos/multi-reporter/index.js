const { Tool, Pipeline } = require('../../lib');
const { MultiSubRoutine } = require('../routines');

const tool = new Tool(
  {
    appName: 'demos-multi-reporter',
    console: { footer: 'Powered by Boost' },
  },
  process.argv.slice(2),
);

new Pipeline(tool)
  .pipe(new MultiSubRoutine('parallel', 'Parallel routines', { parallel: true }))
  .pipe(new MultiSubRoutine('serial', 'Serial routines'))
  .run();
