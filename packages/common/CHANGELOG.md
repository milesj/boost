# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.9.0 - 2020-06-21

#### 🚀 Updates

- Add `isFilePath` helper. ([4e8676c](https://github.com/milesj/boost/commit/4e8676c))
- Add `isModuleName` helper. ([b28fac3](https://github.com/milesj/boost/commit/b28fac3))
- Add JSON and YAML serializers. (#82) ([ce5b718](https://github.com/milesj/boost/commit/ce5b718)), closes [#82](https://github.com/milesj/boost/issues/82)

#### 🛠 Internals

- Increase code coverage. ([b4eb8cf](https://github.com/milesj/boost/commit/b4eb8cf))

**Note:** Version bump only for package @boost/common





### 1.8.5 - 2020-04-29

#### 🛠 Internals

- Increase code coverage. ([b21824b](https://github.com/milesj/boost/commit/b21824b))

**Note:** Version bump only for package @boost/common





### 1.8.4 - 2020-04-17

#### 📦 Dependencies

- Update minor and patch versions. ([6f5a039](https://github.com/milesj/boost/commit/6f5a039))

**Note:** Version bump only for package @boost/common





### 1.8.3 - 2020-03-22

#### 🐞 Fixes

- **[Path]** When cast to JSON, will now use the file path. ([fc225b2](https://github.com/milesj/boost/commit/fc225b2))

#### 📦 Dependencies

- **[json5]** Update to latest. ([796e287](https://github.com/milesj/boost/commit/796e287))

**Note:** Version bump only for package @boost/common





### 1.8.2 - 2020-02-04

#### ⚙️ Types

- Add `PackageStructure` type. ([dcb4f52](https://github.com/milesj/boost/commit/dcb4f52))

#### 📦 Dependencies

- **[optimal]** Update to v4.2. ([85aeb76](https://github.com/milesj/boost/commit/85aeb76))

**Note:** Version bump only for package @boost/common





### 1.8.1 - 2020-01-25

#### 🐞 Fixes

- Bump all packages to fix build issues. ([a8e8112](https://github.com/milesj/boost/commit/a8e8112))

**Note:** Version bump only for package @boost/common





## 1.8.0 - 2020-01-25

#### 🚀 Updates

- Add `createBlueprint()` helper function. ([7047424](https://github.com/milesj/boost/commit/7047424))
- Export optimal predicates from the index. ([cac3fc7](https://github.com/milesj/boost/commit/cac3fc7))

#### 📦 Dependencies

- **[optimal]** Update to v3.4. ([2ef70ff](https://github.com/milesj/boost/commit/2ef70ff))
- **[optimal]** Update to v4. ([d52cc7c](https://github.com/milesj/boost/commit/d52cc7c))

**Note:** Version bump only for package @boost/common





## 1.7.0 - 2019-12-27

#### 🚀 Updates

- **[Contract]** Updated `configure()` to accept a setter function. ([2938a9f](https://github.com/milesj/boost/commit/2938a9f))

#### 🐞 Fixes

- **[Contract]** Dont deep freeze the options object. ([b378abf](https://github.com/milesj/boost/commit/b378abf))

**Note:** Version bump only for package @boost/common





## 1.6.0 - 2019-12-07

#### 🚀 Updates

- **[PathResolver]** Add a mechanism for finding and resolving a path amongst a list of file paths or node modules. (#71) ([465e535](https://github.com/milesj/boost/commit/465e535)), closes [#71](https://github.com/milesj/boost/issues/71)
- Add `deepFreeze` helper function. ([03472fa](https://github.com/milesj/boost/commit/03472fa))

#### ⚙️ Types

- Add `ModuleName` and `Toolable` types. ([80d739f](https://github.com/milesj/boost/commit/80d739f))

#### 📦 Dependencies

- **[optimal]** Update to v3.3. ([968d36b](https://github.com/milesj/boost/commit/968d36b))

**Note:** Version bump only for package @boost/common





## 1.5.0 - 2019-11-28

#### 🚀 Updates

- **[Path]** Add `equals`, `relativeTo`, `realPath`, and more. (#69) ([2f72628](https://github.com/milesj/boost/commit/2f72628)), closes [#69](https://github.com/milesj/boost/issues/69)

**Note:** Version bump only for package @boost/common





## 1.4.0 - 2019-11-26

#### 🚀 Updates

- Support Windows OS and Node v13. (#68) ([bca6786](https://github.com/milesj/boost/commit/bca6786)), closes [#68](https://github.com/milesj/boost/issues/68)

**Note:** Version bump only for package @boost/common





## 1.3.0 - 2019-11-24

#### 🚀 Updates

- Add new `Path` class for managing file paths. (#67) ([736ec2b](https://github.com/milesj/boost/commit/736ec2b)), closes [#67](https://github.com/milesj/boost/issues/67)

#### 📦 Dependencies

- Update minor and patch versions. ([24c80fc](https://github.com/milesj/boost/commit/24c80fc))

**Note:** Version bump only for package @boost/common





### 1.2.2 - 2019-11-12

#### 📘 Docs

- Fix GitHub CI badge. ([122c369](https://github.com/milesj/boost/tree/master/packages/common/commit/122c369))

#### 📦 Dependencies

- Moved `[@types](https://github.com/types)` to the root and out of packages. ([497d312](https://github.com/milesj/boost/tree/master/packages/common/commit/497d312))

#### 📋 Misc

- Add funding to all packages. ([863a614](https://github.com/milesj/boost/tree/master/packages/common/commit/863a614))

#### 🛠 Internals

- Migrate to GitHub CI and actions. (#65) ([ce59e85](https://github.com/milesj/boost/tree/master/packages/common/commit/ce59e85)), closes [#65](https://github.com/milesj/boost/tree/master/packages/common/issues/65)

**Note:** Version bump only for package @boost/common





### 1.2.1 - 2019-10-30

#### 📦 Dependencies

- Update minor and patch versions. ([870dd85](https://github.com/milesj/boost/tree/master/packages/common/commit/870dd85))

**Note:** Version bump only for package @boost/common





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
