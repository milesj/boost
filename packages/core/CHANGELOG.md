# 1.6.0

#### 🚀 New

- Constants are now exported from the index.

#### 🐞 Fixed

- Fixed some cross-realm `instanceof` check issues.

#### 🛠 Internal

- TS: `TaskAction` is now exported.

# 1.5.0 - 2019-01-13

#### 🎉 Release

In an effort to test the new CLI rendering engine, this release includes a new
[nyan cat](http://www.nyan.cat/) reporter! Install with `@boost/reporter-nyan` and enable with
`--reporter=nyan`.

#### 🚀 New

- Added `Tool#isCI` method to check if in a CI environment.
- Added `Tool#isPluginEnabled` method to check if a plugin by type has been enabled.
- Added `Console#isFinalRender` and `Reporter#isFinalRender` methods to check whether it's the final
  render or not.
- Added `Plugin#blueprint`, `Reporter#blueprint`, and `Routine#blueprint` as a means to validate and
  build options passed to the constructor.
- Added `Reporter#hasColorSupport` to check for terminal color support.
- Added an `ExitError` class.
- Updated `Tool#exit` to accept an exit code as the 2nd argument.
- Registered plugins can now define a list of custom NPM `scopes` to lookup modules in.

#### 🐞 Fixed

- `ctrl + c` should now exit the render loop properly.

#### 🛠 Internal

- Deprecated `Tool#loadWorkspacePackages`. Use `Tool#getWorkspacePackages` instead.
- TS: `Tool#loadConfig`, `loadPlugins`, `loadReporters` have been marked `protected`.
- TS: `Console#final`, `started`, `stopped` have been marked `protected`.

# 1.4.1 - 2019-01-08

#### 🐞 Fixed

- Fixed `--debug` not enabling in some situations.

# 1.4.0 - 2019-01-07

#### 🎉 Release

Complete rewrite of the console rendering layer, which now utilizes a render loop that continuously
renders "blocks" or "lines" of output at 16 FPS. Implementation is much faster, much cleaner, more
customizable, and properly handles outside interferrence, like `console` logs or `stderr` writes.

#### 🚀 New

- Added `routine.skip` and `task.skip` events to executors.
- Added `Routine#metadata` and `Task#metadata` property objects, which includes:
  - `depth` (number) - The routine hierarchy depth.
  - `index` (number) - The index within its parent collection.
  - `startTime`, `stopTime` - Execution timestamps.
- Added `Routine#isComplete()` and `Task#isComplete()` methods.
- Added `Reporter.BUFFER`, `OUTPUT_COMPACT`, `OUTPUT_NORMAL`, `OUTPUT_VERBOSE` static properties.
- Added `Reporter#calculateTaskCompletion`, `getOutputLevel`, `getRootParent`, `isSilent` methods.

#### 🐞 Fixed

- Updated `Reporter#displayError` to write to `stderr`.
- Updated `Reporter#indent` to properly handle negative numbers.

#### 🛠 Internal

- Changed default output level to `2` (normal) from `3` (verbose).
- TS: Added generics to `Tool#loadWorkspacePackages()` to customize additional package config
  fields.
- TS: `execute()` and `run()` methods now type the value as `any` instead of using generics.

# 1.3.0 - 2019-01-01

#### 🚀 New

- Added `Tool#getWorkspacePaths`, `getWorkspacePackagePaths`, and `loadWorkspacePackages` helper
  methods.
- TS: Added `CLI` generic for Yargs typings.

# 1.2.1 - 2018-12-28

#### 🐞 Fixed

- Reverted some typing issues in relation to partial options.

# 1.2.0 - 2018-12-26

#### 🚀 New

- Added `Reporter#size` to gather terminal information, like the column and row count.
- Updated `Reporter#truncate` and `wrap` to default column count automatically.
- Updated `Reporter#out` and `err` to always be defined, but a no-op if no stream available.
- Updated `Task` and `Routine` to extend from `Emitter` so they may emit events.
  - Added `run`, `skip`, `pass`, and `fail` events.

#### 🐞 Fixed

- Fixed a reporter bug in which task statuses were not wrapping properly, causing subsequent renders
  to get out of sync.
- Refactored executors to be slightly more performant.

#### 🛠 Internal

- Updated console output to use `ansi-escapes` package.
- Updated dependencies.

# 1.1.0 - 2018-12-12

#### 🚀 New

- Added `Tool#logLive` to display live messages during a running process. These messages will be
  removed on the success or failure of the process.

#### 🛠 Internal

- Updated dependencies.

# 1.0.4 - 2018-11-27

#### 🛠 Internal

- Updated dependencies.

# 1.0.3 - 2018-10-30

#### 🐞 Fixed

- Added an `exiting` boolean to the console to handle multiple calls to `exit`.

# 1.0.2 - 2018-10-29

#### 🐞 Fixed

- Added a delay before exiting the console so that CIs can buffer output effectively.

# 1.0.1 - 2018-10-23

#### 🐞 Fixed

- Fixed an issue where console signals were causing re-render issues.

# 1.0.0 - 2018-10-19

#### 🎉 Release

- Initial release!
