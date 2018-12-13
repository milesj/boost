# 1.1.0 - 12/12/18

#### 🚀 New

- Added a `Tool#logLive` method to display live messages during a running process. These messages
  will be removed on the success or failure of the process.

#### 🛠 Internal

- Update dependencies.

# 1.0.4 - 11/27/18

#### 🛠 Internal

- Update dependencies.

# 1.0.3 - 10/30/18

#### 🐞 Fixes

- Added an `exiting` boolean to the console to handle multiple calls to `exit`.

# 1.0.2 - 10/29/18

#### 🐞 Fixes

- Added a delay before exiting the console so that CIs can buffer output effectively.

# 1.0.1 - 10/23/18

#### 🐞 Fixes

- Fixed an issue where console signals were causing re-render issues.

# 1.0.0 - 10/19/18

#### 🎉 Release

- Initial release!
