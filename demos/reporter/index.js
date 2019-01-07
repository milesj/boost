const { Tool, Pipeline } = require('../../packages/core/lib');
const { MultiTaskRoutine, MultiSubRoutine } = require('../routines');

const tool = new Tool(
  {
    appName: 'demos-reporter',
    appPath: __dirname,
    footer: 'Powered by Boost',
  },
  process.argv.slice(2),
);

new Pipeline(tool)
  .pipe(new MultiTaskRoutine('skipped', 'Skipped routine').skip(true))
  // .pipe(new MultiTaskRoutine('multiple', 'Multi-task routine'))
  // .pipe(new MultiTaskRoutine('multi', 'Multi-task routine again'))
  // .pipe(new MultiSubRoutine('parallel', 'Parallel routines', { parallel: true }))
  // .pipe(new MultiTaskRoutine('error', 'Routine that will fail', { error: true }))
  .pipe(new MultiTaskRoutine('parallel', 'Parallel tasks', { parallel: true }))
  .pipe(new MultiSubRoutine('subs', 'Multi-routine', { deep: true }))
  .run();
