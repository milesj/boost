# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
