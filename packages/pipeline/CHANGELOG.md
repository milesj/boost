# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Rename `onRun` and `onFinish` events. ([d3c758d](https://github.com/milesj/boost/commit/d3c758d))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Add `wrap` option for `Routine#executeCommand()`. ([aea7086](https://github.com/milesj/boost/commit/aea7086))
- Add new `Monitor` class for monitoring events through an entire hierarchy. ([15f88b6](https://github.com/milesj/boost/commit/15f88b6))
- Refactor blueprint generics for easier inheritance usage. ([0dd8171](https://github.com/milesj/boost/commit/0dd8171))

#### ⚙️ Types

- Improve `blueprint()` inheritance. ([da176e8](https://github.com/milesj/boost/commit/da176e8))
- Update `Action` runner to be a work unit. ([89bba24](https://github.com/milesj/boost/commit/89bba24))

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
- **[execa]** Update to v4. ([e4a47d5](https://github.com/milesj/boost/commit/e4a47d5))

#### 🛠 Internals

- Move debugger and translators outside of constants. ([a0af1b4](https://github.com/milesj/boost/commit/a0af1b4))
- Replace `RuntimeError` with new packaged scoped errors. ([c13d3f1](https://github.com/milesj/boost/commit/c13d3f1))

**Note:** Version bump only for package @boost/pipeline





### 1.5.3 - 2020-06-21

**Note:** Version bump only for package @boost/pipeline





### 1.5.2 - 2020-04-29

**Note:** Version bump only for package @boost/pipeline





### 1.5.1 - 2020-04-17

**Note:** Version bump only for package @boost/pipeline





## 1.5.0 - 2020-03-22

#### 🚀 Updates

- **[Pipeline]** Add `onFinish` event. ([a95fe50](https://github.com/milesj/boost/commit/a95fe50))
- **[Routine]** Updated `key` to support an array of strings. ([fdd13f7](https://github.com/milesj/boost/commit/fdd13f7))
- **[WorkUnit]** Add new `id` property. ([948e1b2](https://github.com/milesj/boost/commit/948e1b2))

#### 🛠 Internals

- Removed a lot of noisy debug logging. ([39b59dc](https://github.com/milesj/boost/commit/39b59dc))

**Note:** Version bump only for package @boost/pipeline





## 1.4.0 - 2020-02-04

#### 🚀 Updates

- Add more internal debugging. (#74) ([70c42c8](https://github.com/milesj/boost/commit/70c42c8)), closes [#74](https://github.com/milesj/boost/issues/74)

**Note:** Version bump only for package @boost/pipeline





### 1.3.5 - 2020-01-25

#### 🐞 Fixes

- Bump all packages to fix build issues. ([a8e8112](https://github.com/milesj/boost/commit/a8e8112))

**Note:** Version bump only for package @boost/pipeline





### 1.3.4 - 2020-01-25

**Note:** Version bump only for package @boost/pipeline





### 1.3.3 - 2019-12-27

**Note:** Version bump only for package @boost/pipeline





### 1.3.2 - 2019-12-07

**Note:** Version bump only for package @boost/pipeline





### 1.3.1 - 2019-11-28

**Note:** Version bump only for package @boost/pipeline





## 1.3.0 - 2019-11-26

#### 🚀 Updates

- Support Windows OS and Node v13. (#68) ([bca6786](https://github.com/milesj/boost/commit/bca6786)), closes [#68](https://github.com/milesj/boost/issues/68)

**Note:** Version bump only for package @boost/pipeline





### 1.2.4 - 2019-11-24

#### 📦 Dependencies

- Update minor and patch versions. ([24c80fc](https://github.com/milesj/boost/commit/24c80fc))

**Note:** Version bump only for package @boost/pipeline





### 1.2.3 - 2019-11-12

#### 📘 Docs

- Fix GitHub CI badge. ([122c369](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/122c369))

#### 📦 Dependencies

- Moved `[@types](https://github.com/types)` to the root and out of packages. ([497d312](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/497d312))
- Update root dependencies. ([95d72a0](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/95d72a0))

#### 📋 Misc

- Add funding to all packages. ([863a614](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/863a614))

#### 🛠 Internals

- Migrate to GitHub CI and actions. (#65) ([ce59e85](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/ce59e85)), closes [#65](https://github.com/milesj/boost/tree/master/packages/pipeline/issues/65)

**Note:** Version bump only for package @boost/pipeline





### 1.2.2 - 2019-10-30

#### 📦 Dependencies

- Update minor and patch versions. ([870dd85](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/870dd85))
- **[execa]** Update to v3. ([2af89f0](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/2af89f0))

**Note:** Version bump only for package @boost/pipeline





### 1.2.1 - 2019-09-09

#### 📦 Dependencies

- Update minor and patch versions. ([500bec6](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/500bec6))

#### 🛠 Internals

- Remove depracated error config file. ([d0684a3](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/d0684a3))

**Note:** Version bump only for package @boost/pipeline





## 1.2.0 - 2019-08-03

#### 🚀 Updates

- Reworked `Pipeline` initial values to support optional. Input type now defaults to `unknown`. ([beca9c6](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/beca9c6))

#### ⚙️ Types

- Removed `Context` constraint from `WorkUnit#run` and `Routine#execute`. ([b470ec3](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/b470ec3))
- Reversed `Routine` generic slots. ([0cebefc](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/0cebefc))

**Note:** Version bump only for package @boost/pipeline





## 1.1.0 - 2019-08-03

#### 🚀 Updates

- Migrate to new RuntimeError layer. ([0793ffd](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/0793ffd))

**Note:** Version bump only for package @boost/pipeline





# 1.0.0 - 2019-08-01

#### 🎉 Release

- Add new `@boost/pipeline` package. (#53) ([008c543](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/008c543)), closes [#53](https://github.com/milesj/boost/tree/master/packages/pipeline/issues/53)

#### ⚙️ Types

- Refine types and replace `any` with `unknown`. (#58) ([43512fc](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/43512fc)), closes [#58](https://github.com/milesj/boost/tree/master/packages/pipeline/issues/58)

#### 📦 Dependencies

- Update all dependencies. ([7127236](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/7127236))

#### 🛠 Internals

- Disable specific lint rules. ([81e863a](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/81e863a))
- Increase statement and function code coverage to 100%. ([7c98aa7](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/7c98aa7))
- Verify `SerialPipeline` passes correct constructor args. ([ad387ef](https://github.com/milesj/boost/tree/master/packages/pipeline/commit/ad387ef))

**Note:** Version bump only for package @boost/pipeline
