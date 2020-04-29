# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 1.3.1 - 2020-04-29

**Note:** Version bump only for package @boost/event





## 1.3.0 - 2020-02-04

#### 🚀 Updates

- Add more internal debugging. (#74) ([70c42c8](https://github.com/milesj/boost/commit/70c42c8)), closes [#74](https://github.com/milesj/boost/issues/74)

**Note:** Version bump only for package @boost/event





### 1.2.1 - 2020-01-25

#### 🐞 Fixes

- Bump all packages to fix build issues. ([a8e8112](https://github.com/milesj/boost/commit/a8e8112))

**Note:** Version bump only for package @boost/event





## 1.2.0 - 2019-12-27

#### 🚀 Updates

- Support Windows OS and Node v13. (#68) ([bca6786](https://github.com/milesj/boost/commit/bca6786)), closes [#68](https://github.com/milesj/boost/issues/68)

**Note:** Version bump only for package @boost/event





### 1.1.1 - 2019-11-12

#### 📘 Docs

- Fix GitHub CI badge. ([122c369](https://github.com/milesj/boost/tree/master/packages/event/commit/122c369))

#### 📋 Misc

- Add funding to all packages. ([863a614](https://github.com/milesj/boost/tree/master/packages/event/commit/863a614))

#### 🛠 Internals

- Migrate to GitHub CI and actions. (#65) ([ce59e85](https://github.com/milesj/boost/tree/master/packages/event/commit/ce59e85)), closes [#65](https://github.com/milesj/boost/tree/master/packages/event/issues/65)

**Note:** Version bump only for package @boost/event





## 1.1.0 - 2019-08-03

#### 🚀 Updates

- Migrate to new RuntimeError layer. ([0793ffd](https://github.com/milesj/boost/tree/master/packages/event/commit/0793ffd))

**Note:** Version bump only for package @boost/event





### 1.0.3 - 2019-08-01

#### ⚙️ Types

- Refine types and replace `any` with `unknown`. (#58) ([43512fc](https://github.com/milesj/boost/tree/master/packages/event/commit/43512fc)), closes [#58](https://github.com/milesj/boost/tree/master/packages/event/issues/58)

#### 📘 Docs

- Add examples to readmes. ([fa6a90c](https://github.com/milesj/boost/tree/master/packages/event/commit/fa6a90c))

**Note:** Version bump only for package @boost/event





### 1.0.2 - 2019-07-04

#### 🛠 Internals

- Added more files to npmignore. ([16f46b8](https://github.com/milesj/boost/tree/master/packages/event/commit/16f46b8))
- Setup DangerJS and conventional changelog (#54) ([a18dd45](https://github.com/milesj/boost/tree/master/packages/event/commit/a18dd45)), closes [#54](https://github.com/milesj/boost/tree/master/packages/event/issues/54)

**Note:** Version bump only for package @boost/event





# 1.0.0 - 2019-04-16

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Added `Event`, which synchronously fires listeners.
- Added `BailEvent`, which will bail the loop if a listener returns `false`.
- Added `ConcurrentEvent`, which asynchronously fires listeners and return a promise.
- Added `WaterfallEvent`, which passes the return value to each listener.

#### 🛠 Internals

- **[ts]** Refactored the type system to strictly and explicitly type all possible events,
  listeners, and their arguments.
