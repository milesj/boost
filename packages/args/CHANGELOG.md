# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 2.3.2 - 2021-03-26

#### 📦 Dependencies

- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)

**Note:** Version bump only for package @boost/args





### 2.3.1 - 2021-02-08

#### 🛠 Internals

- Sort type hints and aliases. ([1c49e33](https://github.com/milesj/boost/commit/1c49e33))

**Note:** Version bump only for package @boost/args





## 2.3.0 - 2021-01-16

#### 🚀 Updates

- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

**Note:** Version bump only for package @boost/args





### 2.2.3 - 2020-11-29

**Note:** Version bump only for package @boost/args





### 2.2.2 - 2020-10-27

#### 🐞 Fixes

- Dont validate choices for empty values. ([6aae375](https://github.com/milesj/boost/commit/6aae375))

**Note:** Version bump only for package @boost/args





### 2.2.1 - 2020-10-08

**Note:** Version bump only for package @boost/args





## 2.2.0 - 2020-09-15

#### 🚀 Updates

- Add support for `loose` mode. (#114) ([fc2210d](https://github.com/milesj/boost/commit/fc2210d)), closes [#114](https://github.com/milesj/boost/issues/114)

**Note:** Version bump only for package @boost/args





## 2.1.0 - 2020-08-17

#### 🚀 Updates

- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

#### 📘 Docs

- Migrate to Docusaurus. (#105) ([24196b8](https://github.com/milesj/boost/commit/24196b8)), closes [#105](https://github.com/milesj/boost/issues/105)

#### 📦 Dependencies

- Update root dependencies. ([9c3203a](https://github.com/milesj/boost/commit/9c3203a))

**Note:** Version bump only for package @boost/args





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Add `format` setting for options and params. (#95) ([e81518a](https://github.com/milesj/boost/commit/e81518a)), closes [#95](https://github.com/milesj/boost/issues/95)

#### ⚙️ Types

- Update `Arguments` to default the params generic. ([7303518](https://github.com/milesj/boost/commit/7303518))

#### 🎨 Styles

- Run Prettier. ([5cd5fc1](https://github.com/milesj/boost/commit/5cd5fc1))

#### 📘 Docs

- Update copyright years. ([1942675](https://github.com/milesj/boost/commit/1942675))
- Update license copyright year. ([e532427](https://github.com/milesj/boost/commit/e532427))
- Update readmes. ([84ca011](https://github.com/milesj/boost/commit/84ca011))

#### 📦 Dependencies

- Migrate packages to v2 alpha. ([64731d9](https://github.com/milesj/boost/commit/64731d9))
- Update final peer dependencies. ([405b8ff](https://github.com/milesj/boost/commit/405b8ff))
- Update TypeScript, Jest, ESLint, and other developer packages. ([c7347a2](https://github.com/milesj/boost/commit/c7347a2))

#### 🛠 Internals

- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/args





### 1.4.1 - 2020-04-29

**Note:** Version bump only for package @boost/args





## 1.4.0 - 2020-04-17

#### 🚀 Updates

- Add did you mean levenary to unknown options. ([a102491](https://github.com/milesj/boost/commit/a102491))
- Add variadic params support. ([43343f0](https://github.com/milesj/boost/commit/43343f0))

**Note:** Version bump only for package @boost/args





## 1.3.0 - 2020-04-08

#### 🚀 Updates

- Added option categories. ([455e03b](https://github.com/milesj/boost/commit/455e03b))
- Properly support default values for params. ([e7fca74](https://github.com/milesj/boost/commit/e7fca74))

#### ⚙️ Types

- Add `category` to `Command`. ([214be93](https://github.com/milesj/boost/commit/214be93))
- Removed `default` from `Param`. ([8c96605](https://github.com/milesj/boost/commit/8c96605))

**Note:** Version bump only for package @boost/args





### 1.2.1 - 2020-03-22

#### ⚙️ Types

- Update `Command` usage to support arrays. ([ad04465](https://github.com/milesj/boost/commit/ad04465))

**Note:** Version bump only for package @boost/args





## 1.2.0 - 2020-02-04

#### 🚀 Updates

- Add more internal debugging. (#74) ([70c42c8](https://github.com/milesj/boost/commit/70c42c8)), closes [#74](https://github.com/milesj/boost/issues/74)

**Note:** Version bump only for package @boost/args





### 1.1.2 - 2020-01-25

#### 🐞 Fixes

- Bump all packages to fix build issues. ([a8e8112](https://github.com/milesj/boost/commit/a8e8112))

**Note:** Version bump only for package @boost/args





### 1.1.1 - 2020-01-25

#### ⚙️ Types

- **[Arg]** Add null support to `validate`. ([35e24e4](https://github.com/milesj/boost/commit/35e24e4))

**Note:** Version bump only for package @boost/args





## 1.1.0 - 2019-12-27

#### 🚀 Updates

- Add `parseInContext` function. ([c9b61ca](https://github.com/milesj/boost/commit/c9b61ca))
- Add constants for default values. ([eb6e756](https://github.com/milesj/boost/commit/eb6e756))
- Add direct support for unknown options. ([434b2e9](https://github.com/milesj/boost/commit/434b2e9))

#### ⚙️ Types

- Add `Command` and `Usage` types. ([ae1ecb6](https://github.com/milesj/boost/commit/ae1ecb6))

**Note:** Version bump only for package @boost/args





# 1.0.0 - 2019-11-24

#### 🎉 Release

- Add new `@boost/args` package. (#63) ([6310201](https://github.com/milesj/boost/commit/6310201)), closes [#63](https://github.com/milesj/boost/issues/63)

**Note:** Version bump only for package @boost/args
