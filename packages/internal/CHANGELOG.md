# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 - 2021-10-13

#### 💥 Breaking

- Drop Node.js v10 and IE 11. ([cecbd70](https://github.com/milesj/boost/commit/cecbd70))

#### 📘 Docs

- Fix broken badge images. ([ed85a88](https://github.com/milesj/boost/commit/ed85a88))

#### 🛠 Internals

- Bump versions to an alpha v3 release. ([942d4c4](https://github.com/milesj/boost/commit/942d4c4))

**Note:** Version bump only for package @boost/internal





### 2.2.3 - 2021-07-12

#### 📦 Dependencies

- **[packemon]** Update to v1. (#151) ([7ffd612](https://github.com/milesj/boost/commit/7ffd612)), closes [#151](https://github.com/milesj/boost/issues/151)
- Update minor and patch versions. ([9b2cb32](https://github.com/milesj/boost/commit/9b2cb32))

#### 🛠 Internals

- Migrate to Beemo tooling. (#154) ([0cd2a6f](https://github.com/milesj/boost/commit/0cd2a6f)), closes [#154](https://github.com/milesj/boost/issues/154)

**Note:** Version bump only for package @boost/internal





### 2.2.2 - 2021-03-26

#### 📦 Dependencies

- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)

**Note:** Version bump only for package @boost/internal





### 2.2.1 - 2021-02-08

#### 📦 Dependencies

- **[packemon]** Update to v0.11. ([20a54dc](https://github.com/milesj/boost/commit/20a54dc))

**Note:** Version bump only for package @boost/internal





## 2.2.0 - 2021-01-16

#### 🚀 Updates

- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

**Note:** Version bump only for package @boost/internal





### 2.1.2 - 2020-11-29

#### 📦 Dependencies

- **[debug]** Update to v4.3. ([e1304ee](https://github.com/milesj/boost/commit/e1304ee))

**Note:** Version bump only for package @boost/internal





### 2.1.1 - 2020-10-08

#### 📦 Dependencies

- Update all to latest. ([bb04025](https://github.com/milesj/boost/commit/bb04025))

**Note:** Version bump only for package @boost/internal





## 2.1.0 - 2020-08-17

#### 🚀 Updates

- Add `__DEV__` conditionals for a smaller filesize. ([b04d389](https://github.com/milesj/boost/commit/b04d389))
- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

**Note:** Version bump only for package @boost/internal





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Delete `RuntimeError` class. ([0c0f528](https://github.com/milesj/boost/commit/0c0f528))
- Delete unused `SignalError` class. ([cacc155](https://github.com/milesj/boost/commit/cacc155))
- Drop support for `BOOST_` prefixed env vars. ([85f5f41](https://github.com/milesj/boost/commit/85f5f41))
- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Move `ExitError` to common package. ([6584dc5](https://github.com/milesj/boost/commit/6584dc5))
- Rename `color.pluginType` to `color.symbol`. ([c4aa1a4](https://github.com/milesj/boost/commit/c4aa1a4))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🎨 Styles

- Run Prettier. ([5cd5fc1](https://github.com/milesj/boost/commit/5cd5fc1))

#### 📘 Docs

- Update copyright years. ([1942675](https://github.com/milesj/boost/commit/1942675))
- Update license copyright year. ([e532427](https://github.com/milesj/boost/commit/e532427))

#### 📦 Dependencies

- Migrate packages to v2 alpha. ([64731d9](https://github.com/milesj/boost/commit/64731d9))
- Update final peer dependencies. ([405b8ff](https://github.com/milesj/boost/commit/405b8ff))
- Update TypeScript, Jest, ESLint, and other developer packages. ([c7347a2](https://github.com/milesj/boost/commit/c7347a2))
- **[chalk]** Update to v4.1. ([7086621](https://github.com/milesj/boost/commit/7086621))

#### 🛠 Internals

- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/internal





## 1.2.0 - 2020-04-29

#### 🚀 Updates

- Add test utilities. (#77) ([f8d66ce](https://github.com/milesj/boost/commit/f8d66ce)), closes [#77](https://github.com/milesj/boost/issues/77)

#### 🛠 Internals

- Increase code coverage. ([b21824b](https://github.com/milesj/boost/commit/b21824b))

**Note:** Version bump only for package @boost/internal





## 1.1.0 - 2020-02-04

#### 🚀 Updates

- Add more internal debugging. (#74) ([70c42c8](https://github.com/milesj/boost/commit/70c42c8)), closes [#74](https://github.com/milesj/boost/issues/74)

#### 🛠 Internals

- Rename color helper names. ([29e0791](https://github.com/milesj/boost/commit/29e0791))

**Note:** Version bump only for package @boost/internal





### 1.0.3 - 2020-01-25

#### 🐞 Fixes

- Bump all packages to fix build issues. ([a8e8112](https://github.com/milesj/boost/commit/a8e8112))

**Note:** Version bump only for package @boost/internal





### 1.0.2 - 2019-12-27

#### 🐞 Fixes

- Rename env vars to not collide with Boost C++ library. ([b3d1153](https://github.com/milesj/boost/commit/b3d1153))

**Note:** Version bump only for package @boost/internal





### 1.0.1 - 2019-11-12

#### 📘 Docs

- Fix GitHub CI badge. ([122c369](https://github.com/milesj/boost/tree/master/packages/internal/commit/122c369))

#### 📦 Dependencies

- **[chalk]** Update to v3. ([90b42f2](https://github.com/milesj/boost/tree/master/packages/internal/commit/90b42f2))

#### 📋 Misc

- Add funding to all packages. ([863a614](https://github.com/milesj/boost/tree/master/packages/internal/commit/863a614))

#### 🛠 Internals

- Migrate to GitHub CI and actions. (#65) ([ce59e85](https://github.com/milesj/boost/tree/master/packages/internal/commit/ce59e85)), closes [#65](https://github.com/milesj/boost/tree/master/packages/internal/issues/65)

**Note:** Version bump only for package @boost/internal





# 1.0.0 - 2019-08-03

#### 🎉 Release

- Add new `@boost/internal` package. (#59) ([6d0b12a](https://github.com/milesj/boost/tree/master/packages/internal/commit/6d0b12a)), closes [#59](https://github.com/milesj/boost/tree/master/packages/internal/issues/59)

#### 🚀 Updates

- Add new shared color system with defined presets. ([8c0e123](https://github.com/milesj/boost/tree/master/packages/internal/commit/8c0e123))
- Add support for param interpolation. ([2670580](https://github.com/milesj/boost/tree/master/packages/internal/commit/2670580))
- Move ExitError to internal package. ([ceba173](https://github.com/milesj/boost/tree/master/packages/internal/commit/ceba173))
- Move SignalError to internal package. ([2f7e4ad](https://github.com/milesj/boost/tree/master/packages/internal/commit/2f7e4ad))

**Note:** Version bump only for package @boost/internal
