const { Tool, Pipeline } = require('../../packages/core/lib');
const { MultiTaskRoutine, MultiSubRoutine } = require('../routines');

const tool = new Tool(
  {
    appName: 'demos-reporter',
    console: { footer: 'Powered by Boost' },
  },
  process.argv.slice(2),
);

new Pipeline(tool)
  .pipe(new MultiTaskRoutine('multiple', 'Multi-task routine #1'))
  .pipe(new MultiTaskRoutine('skipped', 'Multi-task routine #2').skip(true))
  .pipe(new MultiSubRoutine('parallel', 'Parallel routines', { parallel: true }))
  .pipe(new MultiTaskRoutine('again', 'Multi-task routine #3', { parallel: true }))
  .pipe(new MultiTaskRoutine('error', 'Routine that will fail', { error: true }))
  // .pipe(new MultiRoutine('subs', 'Multi-routine', { deep: true }))
  .run();
