# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.2.0 - 2022-02-13

#### 🚀 Updates

- Add `Configuration#findRootDir` and `setRootDir` methods. (#175) ([583b766](https://github.com/milesj/boost/commit/583b766)), closes [#175](https://github.com/milesj/boost/issues/175)

#### 📦 Dependencies

- **[minimatch]** Update to latest. ([58dd40d](https://github.com/milesj/boost/commit/58dd40d))

**Note:** Version bump only for package @boost/config





## 3.1.0 - 2022-02-11

#### 🚀 Updates

- Support `<name>.config.<ext>` style root configs. (#174) ([43eb85d](https://github.com/milesj/boost/commit/43eb85d)), closes [#174](https://github.com/milesj/boost/issues/174)

**Note:** Version bump only for package @boost/config





### 3.0.4 - 2022-01-29

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([dfa69a1](https://github.com/milesj/boost/commit/dfa69a1))

**Note:** Version bump only for package @boost/config





### 3.0.3 - 2021-12-19

#### 📦 Dependencies

- **[optimal]** Update to v5.1 latest. ([8adbddf](https://github.com/milesj/boost/commit/8adbddf))

**Note:** Version bump only for package @boost/config





### 3.0.2 - 2021-11-12

**Note:** Version bump only for package @boost/config





### 3.0.1 - 2021-10-16

**Note:** Version bump only for package @boost/config





# 3.0.0 - 2021-10-13

#### 💥 Breaking

- Drop Node.js v10 and IE 11. ([cecbd70](https://github.com/milesj/boost/commit/cecbd70))
- Migrate to `optimal` v5. (#167) ([5422ad0](https://github.com/milesj/boost/commit/5422ad0)), closes [#167](https://github.com/milesj/boost/issues/167)
- Update `Path` to use native directory separator. (#164) ([d057e3d](https://github.com/milesj/boost/commit/d057e3d)), closes [#164](https://github.com/milesj/boost/issues/164)
- Update `PathResolver` and resolver functions to be async. (#162) ([25d5970](https://github.com/milesj/boost/commit/25d5970)), closes [#162](https://github.com/milesj/boost/issues/162)

#### 🚀 Updates

- Migrate to new @boost/module. ([e5d841f](https://github.com/milesj/boost/commit/e5d841f))

#### 🛠 Internals

- Bump versions to an alpha v3 release. ([942d4c4](https://github.com/milesj/boost/commit/942d4c4))

**Note:** Version bump only for package @boost/config





### 2.5.2 - 2021-08-22

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([4e63a11](https://github.com/milesj/boost/commit/4e63a11))

#### 📘 Docs

- Add API links to each readme. ([80cc65f](https://github.com/milesj/boost/commit/80cc65f))
- Add TypeDoc API integration. (#157) ([ca6ac4b](https://github.com/milesj/boost/commit/ca6ac4b)), closes [#157](https://github.com/milesj/boost/issues/157)
- Fix broken badge images. ([ed85a88](https://github.com/milesj/boost/commit/ed85a88))

**Note:** Version bump only for package @boost/config





### 2.5.1 - 2021-07-15

**Note:** Version bump only for package @boost/config





## 2.5.0 - 2021-07-12

#### 🚀 Updates

- **[Configuration,ConfigFinder]** Add resolver option to control module resolution. ([35e1031](https://github.com/milesj/boost/commit/35e1031))

#### 📦 Dependencies

- **[packemon]** Update to v1. (#151) ([7ffd612](https://github.com/milesj/boost/commit/7ffd612)), closes [#151](https://github.com/milesj/boost/issues/151)

#### 🛠 Internals

- Migrate to Beemo tooling. (#154) ([0cd2a6f](https://github.com/milesj/boost/commit/0cd2a6f)), closes [#154](https://github.com/milesj/boost/issues/154)

**Note:** Version bump only for package @boost/config





### 2.4.2 - 2021-03-26

#### 📦 Dependencies

- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)

**Note:** Version bump only for package @boost/config





### 2.4.1 - 2021-02-21

#### 📦 Dependencies

- **[optimal]** Update to v4.3. ([ed51e6f](https://github.com/milesj/boost/commit/ed51e6f))

**Note:** Version bump only for package @boost/config





## 2.4.0 - 2021-02-20

#### 🚀 Updates

- Support tuples (source and options) for plugin settings. (#143) ([4b15a8e](https://github.com/milesj/boost/commit/4b15a8e)), closes [#143](https://github.com/milesj/boost/issues/143)

**Note:** Version bump only for package @boost/config





### 2.3.3 - 2021-02-18

#### 🐞 Fixes

- Migrate JS/CJS loader to use native require. ([84acc48](https://github.com/milesj/boost/commit/84acc48))
- Migrate TS loader to our new typed module loader. ([4cd80f4](https://github.com/milesj/boost/commit/4cd80f4))

#### 🛠 Internals

- Fix broken tests. Move some to isolation. ([5ea4ef2](https://github.com/milesj/boost/commit/5ea4ef2))
- Move to internal fixtures from `memfs`. ([4d46991](https://github.com/milesj/boost/commit/4d46991))
- Switch to local fixtures instead of dynamically created temporary fixtures. ([908936f](https://github.com/milesj/boost/commit/908936f))

**Note:** Version bump only for package @boost/config





### 2.3.2 - 2021-02-12

#### 🐞 Fixes

- Improve debug messages. ([2270fb2](https://github.com/milesj/boost/commit/2270fb2))

**Note:** Version bump only for package @boost/config





### 2.3.1 - 2021-02-08

#### 🛠 Internals

- Sort type hints and aliases. ([1c49e33](https://github.com/milesj/boost/commit/1c49e33))

**Note:** Version bump only for package @boost/config





## 2.3.0 - 2021-01-16

#### 🚀 Updates

- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

**Note:** Version bump only for package @boost/config





### 2.2.8 - 2020-12-07

**Note:** Version bump only for package @boost/config





### 2.2.7 - 2020-11-29

#### 📦 Dependencies

- Update dev dependencies. Migrate to TypeScript v4.1. ([578d5e3](https://github.com/milesj/boost/commit/578d5e3))

**Note:** Version bump only for package @boost/config





### 2.2.6 - 2020-11-11

**Note:** Version bump only for package @boost/config





### 2.2.5 - 2020-11-04

**Note:** Version bump only for package @boost/config





### 2.2.4 - 2020-10-15

**Note:** Version bump only for package @boost/config





### 2.2.3 - 2020-10-09

**Note:** Version bump only for package @boost/config





### 2.2.2 - 2020-10-08

**Note:** Version bump only for package @boost/config





### 2.2.1 - 2020-09-15

**Note:** Version bump only for package @boost/config





## 2.2.0 - 2020-08-17

#### 🚀 Updates

- Add support for `json5` file format. (#112) ([21f31d7](https://github.com/milesj/boost/commit/21f31d7)), closes [#112](https://github.com/milesj/boost/issues/112)
- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- Support TypeScript (`.ts`) config file types/loaders. (#110) ([2e7774f](https://github.com/milesj/boost/commit/2e7774f)), closes [#110](https://github.com/milesj/boost/issues/110)
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

#### 📘 Docs

- Add configuration docs. (#111) ([ca3ade6](https://github.com/milesj/boost/commit/ca3ade6)), closes [#111](https://github.com/milesj/boost/issues/111)
- Migrate to Docusaurus. (#105) ([24196b8](https://github.com/milesj/boost/commit/24196b8)), closes [#105](https://github.com/milesj/boost/issues/105)

**Note:** Version bump only for package @boost/config





## 2.1.0 - 2020-07-29

#### 🚀 Updates

- Add events to `Configuration` class. (#101) ([aef720d](https://github.com/milesj/boost/commit/aef720d)), closes [#101](https://github.com/milesj/boost/issues/101)

#### 🛠 Internals

- Fix failing tests after recent `Path` changes. ([ba03708](https://github.com/milesj/boost/commit/ba03708))

**Note:** Version bump only for package @boost/config





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Refactor blueprint generics for easier inheritance usage. ([0dd8171](https://github.com/milesj/boost/commit/0dd8171))
- Support a list of names for plugin settings. ([beb479d](https://github.com/milesj/boost/commit/beb479d))

#### ⚙️ Types

- Update plugin types to work with plugin package. ([e71646f](https://github.com/milesj/boost/commit/e71646f))

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

#### 🛠 Internals

- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/config





# 1.0.0 - 2020-06-21

#### 🎉 Release

- Add new `@boost/config` package. (#81) ([d0d5a19](https://github.com/milesj/boost/commit/d0d5a19)), closes [#81](https://github.com/milesj/boost/issues/81)

**Note:** Version bump only for package @boost/config
