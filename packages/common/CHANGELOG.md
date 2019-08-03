# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.2.0 - 2019-08-03

#### 🚀 Updates

- Migrate to new RuntimeError layer. ([0793ffd](https://github.com/milesj/boost/tree/master/packages/common/commit/0793ffd))

**Note:** Version bump only for package @boost/common





### 1.1.3 - 2019-08-01

#### 🐞 Fixes

- Remove optimal as a peer dependency. Now a normal dependency. ([dc41cd7](https://github.com/milesj/boost/tree/master/packages/common/commit/dc41cd7))

#### ⚙️ Types

- Refine types and replace `any` with `unknown`. (#58) ([43512fc](https://github.com/milesj/boost/tree/master/packages/common/commit/43512fc)), closes [#58](https://github.com/milesj/boost/tree/master/packages/common/issues/58)

#### 🛠 Internals

- Increase statement and function code coverage to 100%. ([7c98aa7](https://github.com/milesj/boost/tree/master/packages/common/commit/7c98aa7))

**Note:** Version bump only for package @boost/common





### 1.1.2 - 2019-07-07

#### 📦 Dependencies

- Updated dev and build deps. ([c94e3e8](https://github.com/milesj/boost/tree/master/packages/common/commit/c94e3e8))

**Note:** Version bump only for package @boost/common





### 1.1.1 - 2019-07-04

#### 🐞 Fixes

- Updated AggregatedResponse type to infer the result type. ([607c694](https://github.com/milesj/boost/tree/master/packages/common/commit/607c694))

#### 🛠 Internals

- Added more files to npmignore. ([16f46b8](https://github.com/milesj/boost/tree/master/packages/common/commit/16f46b8))
- Fix common and test utils reference. ([304a867](https://github.com/milesj/boost/tree/master/packages/common/commit/304a867))
- Setup DangerJS and conventional changelog (#54) ([a18dd45](https://github.com/milesj/boost/tree/master/packages/common/commit/a18dd45)), closes [#54](https://github.com/milesj/boost/tree/master/packages/common/issues/54)

**Note:** Version bump only for package @boost/common





## 1.1.0 - 2019-06-21

#### 🚀 Updates

- Added `formatMs`, `instanceOf`, `isEmpty`, `isObject`, `parseFile`, `requireModule`, and `toArray`
  helper functions.
- Added `Contract#configure` as a means to update the options object after instantiation.
- Updated the `Contract` options object to be frozen after each configure.

### 1.0.1 - 2019-05-09

#### 📦 Dependencies

- Updated `optimal`.

# 1.0.0 - 2019-04-16

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Added `Contract` abstract class.
