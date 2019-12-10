# Crash Reporting

Report important environmental information when an error occurs or a process crashes.

## Installation

```
yarn add @boost/debug
```

## Usage

Sometimes an application or script fails. Sometimes we want to write an error log with environmental
information about the failure. Boost supports this exact scenario.

Take advantage of crash reporting by importing and instantiating the `CrashReporter` class.

```ts
import { CrashReporter } from '@boost/debug';

const reporter = new CrashReporter();
```

The reporter supports a collection of chainable methods that log targeted information, grouped into
sections. The following methods are available on `CrashReporter`.

- `reportBinaries()` - Reports binary versions and paths for Node, NPM, and Yarn.
- `reportEnvVars()` - Sorts and reports all environment variables.
- `reportLanguages()` - Reports versions and paths for common programming languages, like Java,
  Python, Ruby, and more.
- `reportPackageVersions()` - Report NPM package versions for all that match the defined pattern(s).
- `reportProcess()` - Reports information about the currently running process.
- `reportStackTrace(error: Error)` - Reports the stack trace for the provided `Error`.
- `reportSystem()`- Reports information about the system, OS, and platform.

```ts
reporter
  .reportPackageVersions('@boost/*')
  .reportBinaries()
  .reportEnvVars()
  .reportSystem();
```

If you'd like to add your own section and label value pairs, use `CrashReporter#addSection`, which
requires a title, and `CrashReporter#add`, which accepts a label and one or many values.

```ts
reporter
  .addSection('User')
  .add('ID', user.id)
  .add('Name', user.name)
  .add('Location', user.address, user.country);
```

Once all the information has been buffered, we can write the content to a log file by using
`CrashReporter#write`, which requires an absolute file path.

```ts
reporter.write(path.join(process.cwd(), 'error.log'));
```
