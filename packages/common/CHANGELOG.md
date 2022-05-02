# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0-alpha.1 - 2022-05-02

#### 💥 Breaking

- Add `exports` to all `package.json`s. ([c520941](https://github.com/milesj/boost/commit/c520941))
- Drop Node.js v12 support. (#177) ([5f8a392](https://github.com/milesj/boost/commit/5f8a392)), closes [#177](https://github.com/milesj/boost/issues/177)

#### 🚀 Updates

- Convert package to `.cjs`. ([9666faa](https://github.com/milesj/boost/commit/9666faa))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([8982df0](https://github.com/milesj/boost/commit/8982df0))
- **[beemo-dev]** Update to latest configs. ([0cdac02](https://github.com/milesj/boost/commit/0cdac02))
- **[json5]** Updated to v2.2. ([b4bd2b5](https://github.com/milesj/boost/commit/b4bd2b5))
- **[packemon]** Update to v2.1. ([05ab522](https://github.com/milesj/boost/commit/05ab522))
- **[yaml]** Update to v2. ([48c993e](https://github.com/milesj/boost/commit/48c993e))

#### 🛠 Internals

- Bump versions to an alpha v4 release. ([6d38bca](https://github.com/milesj/boost/commit/6d38bca))

**Note:** Version bump only for package @boost/common





### 3.2.1 - 2022-01-29

#### 📦 Dependencies

- Updated utility deps. ([89a5d1e](https://github.com/milesj/boost/commit/89a5d1e))

**Note:** Version bump only for package @boost/common





## 3.2.0 - 2021-12-19

#### 🚀 Updates

- Add static `path` method for all `Path` classes. ([b9518bf](https://github.com/milesj/boost/commit/b9518bf))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([dde28c6](https://github.com/milesj/boost/commit/dde28c6))
- **[optimal]** Update to v5.1 latest. ([8adbddf](https://github.com/milesj/boost/commit/8adbddf))

**Note:** Version bump only for package @boost/common





## 3.1.0 - 2021-11-12

#### 🚀 Updates

- Add `VirtualPath` class. ([479ca04](https://github.com/milesj/boost/commit/479ca04))

**Note:** Version bump only for package @boost/common





# 3.0.0 - 2021-10-13

#### 💥 Breaking

- Drop Node.js v10 and IE 11. ([cecbd70](https://github.com/milesj/boost/commit/cecbd70))
- Migrate to `optimal` v5. (#167) ([5422ad0](https://github.com/milesj/boost/commit/5422ad0)), closes [#167](https://github.com/milesj/boost/issues/167)
- Remove `parseFile` function. ([801ab7e](https://github.com/milesj/boost/commit/801ab7e))
- Remove `requireModule` function. ([5f681f8](https://github.com/milesj/boost/commit/5f681f8))
- Update `Path` to use native directory separator. (#164) ([d057e3d](https://github.com/milesj/boost/commit/d057e3d)), closes [#164](https://github.com/milesj/boost/issues/164)
- Update `PathResolver` and resolver functions to be async. (#162) ([25d5970](https://github.com/milesj/boost/commit/25d5970)), closes [#162](https://github.com/milesj/boost/issues/162)
- Update `Project` to use `Path`s. (#165) ([5649886](https://github.com/milesj/boost/commit/5649886)), closes [#165](https://github.com/milesj/boost/issues/165)

#### 🚀 Updates

- Add `load` to json and yaml serializers. ([41236fa](https://github.com/milesj/boost/commit/41236fa))
- **[PathResolver]** Add extension lookup support for file paths. ([98dc5df](https://github.com/milesj/boost/commit/98dc5df))

#### ⚙️ Types

- Change `LookupType` to a string union. ([e1d1853](https://github.com/milesj/boost/commit/e1d1853))
- Switch to new `abstract new` constructor. ([ba4b340](https://github.com/milesj/boost/commit/ba4b340))

#### 🛠 Internals

- Bump versions to an alpha v3 release. ([942d4c4](https://github.com/milesj/boost/commit/942d4c4))

**Note:** Version bump only for package @boost/common





### 2.8.2 - 2021-08-22

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([4e63a11](https://github.com/milesj/boost/commit/4e63a11))

#### 📘 Docs

- Add API links to each readme. ([80cc65f](https://github.com/milesj/boost/commit/80cc65f))
- Add TypeDoc API integration. (#157) ([ca6ac4b](https://github.com/milesj/boost/commit/ca6ac4b)), closes [#157](https://github.com/milesj/boost/issues/157)
- Fix broken badge images. ([ed85a88](https://github.com/milesj/boost/commit/ed85a88))

#### 🛠 Internals

- Use [@beemo](https://github.com/beemo) instead of [@boost](https://github.com/boost) for package graph testing. ([6775e8c](https://github.com/milesj/boost/commit/6775e8c))

**Note:** Version bump only for package @boost/common





### 2.8.1 - 2021-07-15

#### ⚙️ Types

- **[PackageStructure]** Add `dependenciesMeta`, `peerDependenciesMeta`, and more to package types. ([f74ad7c](https://github.com/milesj/boost/commit/f74ad7c))

**Note:** Version bump only for package @boost/common





## 2.8.0 - 2021-07-12

#### 🚀 Updates

- **[PathResolver]** Add support for custom resolvers. ([b57269d](https://github.com/milesj/boost/commit/b57269d))

#### 📦 Dependencies

- **[packemon]** Update to v1. (#151) ([7ffd612](https://github.com/milesj/boost/commit/7ffd612)), closes [#151](https://github.com/milesj/boost/issues/151)
- Update minor and patch versions. ([9b2cb32](https://github.com/milesj/boost/commit/9b2cb32))
- Update to use proper optional peer dependencies syntax. ([679804b](https://github.com/milesj/boost/commit/679804b))

#### 🛠 Internals

- Migrate to Beemo tooling. (#154) ([0cd2a6f](https://github.com/milesj/boost/commit/0cd2a6f)), closes [#154](https://github.com/milesj/boost/issues/154)

**Note:** Version bump only for package @boost/common





### 2.7.2 - 2021-03-26

#### 📦 Dependencies

- Change typescript to an optional peer. ([f19cc0d](https://github.com/milesj/boost/commit/f19cc0d))
- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)
- **[yaml]** Update to latest. ([eb6579c](https://github.com/milesj/boost/commit/eb6579c))

**Note:** Version bump only for package @boost/common





### 2.7.1 - 2021-02-21

#### 📦 Dependencies

- **[optimal]** Update to v4.3. ([ed51e6f](https://github.com/milesj/boost/commit/ed51e6f))

**Note:** Version bump only for package @boost/common





## 2.7.0 - 2021-02-18

#### 🚀 Updates

- Add `requireTypedModule` helper for importing TypeScript files. (#140) ([b3b14aa](https://github.com/milesj/boost/commit/b3b14aa)), closes [#140](https://github.com/milesj/boost/issues/140)

**Note:** Version bump only for package @boost/common





## 2.6.0 - 2021-02-12

#### 🚀 Updates

- Add isPlainObject helper. ([eec761c](https://github.com/milesj/boost/commit/eec761c))

#### 📦 Dependencies

- **[optimal]** Update to v4.2.1. ([b77bade](https://github.com/milesj/boost/commit/b77bade))

**Note:** Version bump only for package @boost/common





### 2.5.1 - 2021-02-08

#### 📦 Dependencies

- **[json5]** Updated to v2.2. ([e029b73](https://github.com/milesj/boost/commit/e029b73))

#### 🛠 Internals

- Sort type hints and aliases. ([1c49e33](https://github.com/milesj/boost/commit/1c49e33))

**Note:** Version bump only for package @boost/common





## 2.5.0 - 2021-01-16

#### 🚀 Updates

- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

**Note:** Version bump only for package @boost/common





### 2.4.1 - 2020-11-29

#### 📦 Dependencies

- Update dev dependencies. Migrate to TypeScript v4.1. ([578d5e3](https://github.com/milesj/boost/commit/578d5e3))

**Note:** Version bump only for package @boost/common





## 2.4.0 - 2020-11-11

#### 🚀 Updates

- Add `PackageGraph` class. (#117) ([6f2d344](https://github.com/milesj/boost/commit/6f2d344)), closes [#117](https://github.com/milesj/boost/issues/117)
- Update package.json related types. ([e2b286a](https://github.com/milesj/boost/commit/e2b286a))

**Note:** Version bump only for package @boost/common





## 2.3.0 - 2020-10-15

#### 🚀 Updates

- Add `deepMerge` helper. ([93659b8](https://github.com/milesj/boost/commit/93659b8))

**Note:** Version bump only for package @boost/common





### 2.2.2 - 2020-10-08

#### 📦 Dependencies

- Update all to latest. ([bb04025](https://github.com/milesj/boost/commit/bb04025))

**Note:** Version bump only for package @boost/common





### 2.2.1 - 2020-09-15

#### 📦 Dependencies

- Update Babel, ESLint, Jest, and TypeScript. ([17befe6](https://github.com/milesj/boost/commit/17befe6))

**Note:** Version bump only for package @boost/common





## 2.2.0 - 2020-08-17

#### 🚀 Updates

- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

#### 🐞 Fixes

- Migrate to `@boost/decorators`. ([5b8846e](https://github.com/milesj/boost/commit/5b8846e))

#### 📘 Docs

- Migrate to Docusaurus. (#105) ([24196b8](https://github.com/milesj/boost/commit/24196b8)), closes [#105](https://github.com/milesj/boost/issues/105)

#### 📦 Dependencies

- Update root dependencies. ([9c3203a](https://github.com/milesj/boost/commit/9c3203a))

**Note:** Version bump only for package @boost/common





## 2.1.0 - 2020-07-29

#### 🚀 Updates

- **[Project]** Add PNPM workspaces support. ([a8df8c9](https://github.com/milesj/boost/commit/a8df8c9))
- Add `@Bind` decorator. ([052e9c4](https://github.com/milesj/boost/commit/052e9c4))
- Add `@Debounce` decorator. ([3a6596f](https://github.com/milesj/boost/commit/3a6596f))
- Add `@Deprecate` decorator. ([ab2b26b](https://github.com/milesj/boost/commit/ab2b26b))
- Add `@Memoize` decorator. ([5bdeb55](https://github.com/milesj/boost/commit/5bdeb55))
- Add `@Throttle` decorator. ([a15c125](https://github.com/milesj/boost/commit/a15c125))

**Note:** Version bump only for package @boost/common





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Move `ExitError` to common package. ([6584dc5](https://github.com/milesj/boost/commit/6584dc5))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Add `Project` class. ([230b2ce](https://github.com/milesj/boost/commit/230b2ce))
- Refactor blueprint generics for easier inheritance usage. ([0dd8171](https://github.com/milesj/boost/commit/0dd8171))

#### ⚙️ Types

- Update `WorkspacePackage` with a default generic. ([26d7973](https://github.com/milesj/boost/commit/26d7973))

#### 🎨 Styles

- Run Prettier. ([5cd5fc1](https://github.com/milesj/boost/commit/5cd5fc1))

#### 📘 Docs

- Update copyright years. ([1942675](https://github.com/milesj/boost/commit/1942675))
- Update license copyright year. ([e532427](https://github.com/milesj/boost/commit/e532427))
- Update readmes. ([84ca011](https://github.com/milesj/boost/commit/84ca011))

#### 📦 Dependencies

- Migrate packages to v2 alpha. ([64731d9](https://github.com/milesj/boost/commit/64731d9))
- Update final peer dependencies. ([405b8ff](https://github.com/milesj/boost/commit/405b8ff))
- Update minor and patch versions. ([a5efcf1](https://github.com/milesj/boost/commit/a5efcf1))
- Update TypeScript, Jest, ESLint, and other developer packages. ([c7347a2](https://github.com/milesj/boost/commit/c7347a2))
- **[pretty-ms]** Update to v7. ([878bec1](https://github.com/milesj/boost/commit/878bec1))

#### 🛠 Internals

- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/common





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
