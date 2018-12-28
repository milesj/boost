# 1.2.1 - 12/28/2018

#### 🐞 Fixed

- Reverted some typing issues in relation to partial options.

# 1.2.0 - 12/26/2018

#### 🚀 New

- Added `Console#size` to gather terminal information, like the column and row count.
- Updated `Console#truncate` and `wrap` to default column count automatically.
- Updated `Console#out` and `err` to always be defined, but a no-op if no stream available.
- Updated `Task` and `Routine` to extend from `Emitter` so they may emit events.
  - Added `run`, `skip`, `pass`, and `fail` events.

#### 🐞 Fixed

- Fixed a reporter bug in which task statuses were not wrapping properly, causing subsequent renders
  to get out of sync.
- Refactored executors to be slightly more performant.

#### 🛠 Internal

- Updated console output to use `ansi-escapes` package.
- Updated dependencies.

# 1.1.0 - 12/12/2018

#### 🚀 New

- Added `Tool#logLive` to display live messages during a running process. These messages will be
  removed on the success or failure of the process.

#### 🛠 Internal

- Updated dependencies.

# 1.0.4 - 11/27/2018

#### 🛠 Internal

- Updated dependencies.

# 1.0.3 - 10/30/2018

#### 🐞 Fixed

- Added an `exiting` boolean to the console to handle multiple calls to `exit`.

# 1.0.2 - 10/29/2018

#### 🐞 Fixed

- Added a delay before exiting the console so that CIs can buffer output effectively.

# 1.0.1 - 10/23/2018

#### 🐞 Fixed

- Fixed an issue where console signals were causing re-render issues.

# 1.0.0 - 10/19/2018

#### 🎉 Release

- Initial release!
