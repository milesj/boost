# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 3.0.3 - 2021-12-19

**Note:** Version bump only for package @boost/plugin





### 3.0.2 - 2021-11-12

**Note:** Version bump only for package @boost/plugin





### 3.0.1 - 2021-10-16

**Note:** Version bump only for package @boost/plugin





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
- Fix flaky tests. ([91a8d9d](https://github.com/milesj/boost/commit/91a8d9d))

**Note:** Version bump only for package @boost/plugin





### 2.4.2 - 2021-08-22

#### 📘 Docs

- Add API links to each readme. ([80cc65f](https://github.com/milesj/boost/commit/80cc65f))
- Add TypeDoc API integration. (#157) ([ca6ac4b](https://github.com/milesj/boost/commit/ca6ac4b)), closes [#157](https://github.com/milesj/boost/issues/157)
- Fix broken badge images. ([ed85a88](https://github.com/milesj/boost/commit/ed85a88))

**Note:** Version bump only for package @boost/plugin





### 2.4.1 - 2021-07-15

**Note:** Version bump only for package @boost/plugin





## 2.4.0 - 2021-07-12

#### 🚀 Updates

- **[Registry]** Add resolver option to control module resolution. ([668e49a](https://github.com/milesj/boost/commit/668e49a))

#### 📦 Dependencies

- **[packemon]** Update to v1. (#151) ([7ffd612](https://github.com/milesj/boost/commit/7ffd612)), closes [#151](https://github.com/milesj/boost/issues/151)
- Update minor and patch versions. ([9b2cb32](https://github.com/milesj/boost/commit/9b2cb32))

#### 🛠 Internals

- Migrate to Beemo tooling. (#154) ([0cd2a6f](https://github.com/milesj/boost/commit/0cd2a6f)), closes [#154](https://github.com/milesj/boost/issues/154)

**Note:** Version bump only for package @boost/plugin





### 2.3.3 - 2021-03-26

#### 📦 Dependencies

- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)

**Note:** Version bump only for package @boost/plugin





### 2.3.2 - 2021-02-22

#### ⚙️ Types

- Undo readonly name on abstract Plugin. ([a743b66](https://github.com/milesj/boost/commit/a743b66))

**Note:** Version bump only for package @boost/plugin





### 2.3.1 - 2021-02-21

**Note:** Version bump only for package @boost/plugin





## 2.3.0 - 2021-02-20

#### 🚀 Updates

- Support tuples (source and options) for plugin settings. (#143) ([4b15a8e](https://github.com/milesj/boost/commit/4b15a8e)), closes [#143](https://github.com/milesj/boost/issues/143)

**Note:** Version bump only for package @boost/plugin





### 2.2.3 - 2021-02-18

#### ⚙️ Types

- Make `name` readonly. ([c1fb000](https://github.com/milesj/boost/commit/c1fb000))

**Note:** Version bump only for package @boost/plugin





### 2.2.2 - 2021-02-12

#### 🐞 Fixes

- Improve debug messages. ([2270fb2](https://github.com/milesj/boost/commit/2270fb2))

**Note:** Version bump only for package @boost/plugin





### 2.2.1 - 2021-02-08

#### 🛠 Internals

- Sort type hints and aliases. ([1c49e33](https://github.com/milesj/boost/commit/1c49e33))

**Note:** Version bump only for package @boost/plugin





## 2.2.0 - 2021-01-16

#### 🚀 Updates

- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

**Note:** Version bump only for package @boost/plugin





### 2.1.8 - 2020-12-07

**Note:** Version bump only for package @boost/plugin





### 2.1.7 - 2020-11-29

**Note:** Version bump only for package @boost/plugin





### 2.1.6 - 2020-11-11

**Note:** Version bump only for package @boost/plugin





### 2.1.5 - 2020-11-04

**Note:** Version bump only for package @boost/plugin





### 2.1.4 - 2020-10-15

**Note:** Version bump only for package @boost/plugin





### 2.1.3 - 2020-10-09

**Note:** Version bump only for package @boost/plugin





### 2.1.2 - 2020-10-08

**Note:** Version bump only for package @boost/plugin





### 2.1.1 - 2020-09-15

#### 🔑 Security

- Fix Lodash vulnerability. ([7932f14](https://github.com/milesj/boost/commit/7932f14))

**Note:** Version bump only for package @boost/plugin





## 2.1.0 - 2020-08-17

#### 🚀 Updates

- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

#### 📘 Docs

- Migrate to Docusaurus. (#105) ([24196b8](https://github.com/milesj/boost/commit/24196b8)), closes [#105](https://github.com/milesj/boost/issues/105)

**Note:** Version bump only for package @boost/plugin





### 2.0.1 - 2020-07-29

**Note:** Version bump only for package @boost/plugin





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Refactor config setting structure. (#92) ([b5029a2](https://github.com/milesj/boost/commit/b5029a2)), closes [#92](https://github.com/milesj/boost/issues/92)
- Rename `color.pluginType` to `color.symbol`. ([c4aa1a4](https://github.com/milesj/boost/commit/c4aa1a4))
- Rename `onRegister` and `onUnregister` events. Add new events. ([41993ae](https://github.com/milesj/boost/commit/41993ae))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Refactor blueprint generics for easier inheritance usage. ([0dd8171](https://github.com/milesj/boost/commit/0dd8171))

#### ⚙️ Types

- Add `FilePath` to all load methods. ([939a3c4](https://github.com/milesj/boost/commit/939a3c4))
- Update `Registry#get` with a generic. ([e7f23f0](https://github.com/milesj/boost/commit/e7f23f0))
- Use any for `Pluggable` so its easier for consumers. ([895aac9](https://github.com/milesj/boost/commit/895aac9))

#### 🎨 Styles

- Run Prettier. ([5cd5fc1](https://github.com/milesj/boost/commit/5cd5fc1))

#### 📘 Docs

- Update copyright years. ([1942675](https://github.com/milesj/boost/commit/1942675))
- Update license copyright year. ([e532427](https://github.com/milesj/boost/commit/e532427))
- Update readmes. ([84ca011](https://github.com/milesj/boost/commit/84ca011))

#### 📦 Dependencies

- Migrate packages to v2 alpha. ([64731d9](https://github.com/milesj/boost/commit/64731d9))
- Update final peer dependencies. ([405b8ff](https://github.com/milesj/boost/commit/405b8ff))
- Update to latest. ([39c68e8](https://github.com/milesj/boost/commit/39c68e8))
- Update TypeScript, Jest, ESLint, and other developer packages. ([c7347a2](https://github.com/milesj/boost/commit/c7347a2))

#### 🛠 Internals

- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/plugin





### 1.0.4 - 2020-06-21

#### 🐞 Fixes

- Update to use common package constants. ([32ccf5a](https://github.com/milesj/boost/commit/32ccf5a))

**Note:** Version bump only for package @boost/plugin





### 1.0.3 - 2020-04-29

**Note:** Version bump only for package @boost/plugin





### 1.0.2 - 2020-04-17

**Note:** Version bump only for package @boost/plugin





### 1.0.1 - 2020-03-22

**Note:** Version bump only for package @boost/plugin





# 1.0.0 - 2020-02-04

#### 🎉 Release

- Add new `@boost/plugin` package. (#61) ([762b9c6](https://github.com/milesj/boost/commit/762b9c6)), closes [#61](https://github.com/milesj/boost/issues/61)

#### 🚀 Updates

- Add more internal debugging. (#74) ([70c42c8](https://github.com/milesj/boost/commit/70c42c8)), closes [#74](https://github.com/milesj/boost/issues/74)

#### 🛠 Internals

- Rename color helper names. ([29e0791](https://github.com/milesj/boost/commit/29e0791))

**Note:** Version bump only for package @boost/plugin
