# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### 2.1.1 - 2020-09-15

#### 📦 Dependencies

- **[ink]** Update to latest. ([2b1a991](https://github.com/milesj/boost/commit/2b1a991))

**Note:** Version bump only for package @boost/cli





## 2.1.0 - 2020-08-17

#### 🚀 Updates

- Build packages with Rollup to support web and node targets. ([38cdad9](https://github.com/milesj/boost/commit/38cdad9))
- **[web]** Rework errors to not rely on Node.js utils. ([7752e7f](https://github.com/milesj/boost/commit/7752e7f))

#### 🎨 Styles

- Add bold to header styles. ([2af09eb](https://github.com/milesj/boost/commit/2af09eb))
- Improve header styles by using hexcode colors. ([2b03281](https://github.com/milesj/boost/commit/2b03281))

#### 📘 Docs

- Migrate to Docusaurus. (#105) ([24196b8](https://github.com/milesj/boost/commit/24196b8)), closes [#105](https://github.com/milesj/boost/issues/105)

#### 📦 Dependencies

- **[ink]** Update to v3 proper. ([c2a434a](https://github.com/milesj/boost/commit/c2a434a))
- Update root dependencies. ([9c3203a](https://github.com/milesj/boost/commit/9c3203a))

**Note:** Version bump only for package @boost/cli





### 2.0.1 - 2020-07-29

**Note:** Version bump only for package @boost/cli





# 2.0.0 - 2020-07-14

#### 💥 Breaking

- Migrate to `fs.promises` API. ([944119a](https://github.com/milesj/boost/commit/944119a))
- Migrate to `ink` v3. Rework `Style` component. ([9bba2ce](https://github.com/milesj/boost/commit/9bba2ce))
- Move `ExitError` to common package. ([6584dc5](https://github.com/milesj/boost/commit/6584dc5))
- Move `ink` to a peer dependency. Remove index exports. ([cc515a6](https://github.com/milesj/boost/commit/cc515a6))
- Reword error codes. ([33b9d96](https://github.com/milesj/boost/commit/33b9d96))
- Updated Node.js minimum requirement to v10.10. ([3719cdc](https://github.com/milesj/boost/commit/3719cdc))

#### 🚀 Updates

- Add `Command#getArguments()` method. ([bf5b345](https://github.com/milesj/boost/commit/bf5b345))
- Add `format` setting for options and params. (#95) ([e81518a](https://github.com/milesj/boost/commit/e81518a)), closes [#95](https://github.com/milesj/boost/issues/95)
- Add formats to logger. ([9d5e1f2](https://github.com/milesj/boost/commit/9d5e1f2))
- Enable terminal themes. (#90) ([aa4d462](https://github.com/milesj/boost/commit/aa4d462)), closes [#90](https://github.com/milesj/boost/issues/90)
- Migrate to new logger. ([ae3e955](https://github.com/milesj/boost/commit/ae3e955))
- Refactor blueprint generics for easier inheritance usage. ([0dd8171](https://github.com/milesj/boost/commit/0dd8171))
- Rework log buffering to support new Ink features. ([2670f9b](https://github.com/milesj/boost/commit/2670f9b))
- Rewrite to use new `Logger` class. ([5e08afb](https://github.com/milesj/boost/commit/5e08afb))

#### ⚙️ Types

- Improve `blueprint()` inheritance. ([da176e8](https://github.com/milesj/boost/commit/da176e8))

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

**Note:** Version bump only for package @boost/cli





### 1.2.1 - 2020-06-21

**Note:** Version bump only for package @boost/cli





## 1.2.0 - 2020-04-29

#### 🚀 Updates

- Add test utilities. (#77) ([f8d66ce](https://github.com/milesj/boost/commit/f8d66ce)), closes [#77](https://github.com/milesj/boost/issues/77)
- Allow tasks to run other tasks. (#80) ([e08519f](https://github.com/milesj/boost/commit/e08519f)), closes [#80](https://github.com/milesj/boost/issues/80)
- Buffer logs until rendering is complete. (#78) ([884a09a](https://github.com/milesj/boost/commit/884a09a)), closes [#78](https://github.com/milesj/boost/issues/78)

**Note:** Version bump only for package @boost/cli





## 1.1.0 - 2020-04-21

#### 🚀 Updates

- Add `Command#executeCommand()` for executing native system commands. ([3148759](https://github.com/milesj/boost/commit/3148759))
- Add new tasks system for easier reusability and composition. ([16b3694](https://github.com/milesj/boost/commit/16b3694))
- Allow usage delimiter to be customized. ([eafc20a](https://github.com/milesj/boost/commit/eafc20a))

#### ⚙️ Types

- Export more types from the args package. ([ee7d44e](https://github.com/milesj/boost/commit/ee7d44e))

#### 🛠 Internals

- Increase code coverage. ([ef40d95](https://github.com/milesj/boost/commit/ef40d95))

**Note:** Version bump only for package @boost/cli





# 1.0.0 - 2020-04-20

#### 🎉 Release

- Add new `@boost/cli` package. (#72) ([de895f5](https://github.com/milesj/boost/commit/de895f5)), closes [#72](https://github.com/milesj/boost/issues/72)

**Note:** Version bump only for package @boost/cli
