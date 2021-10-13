# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 - 2021-10-13

#### 💥 Breaking

- Drop Node.js v10 and IE 11. ([cecbd70](https://github.com/milesj/boost/commit/cecbd70))
- Migrate to `optimal` v5. (#167) ([5422ad0](https://github.com/milesj/boost/commit/5422ad0)), closes [#167](https://github.com/milesj/boost/issues/167)
- Remove React imports from index. Add new sub-module. ([4890e42](https://github.com/milesj/boost/commit/4890e42))
- Remove shorthand/proxy commands. ([01f2689](https://github.com/milesj/boost/commit/01f2689))
- Update `useRenderLoop` to use seconds. ([80e15c8](https://github.com/milesj/boost/commit/80e15c8))

#### 🚀 Updates

- Add new option/param initializer pattern. (#168) ([49707b5](https://github.com/milesj/boost/commit/49707b5)), closes [#168](https://github.com/milesj/boost/issues/168)
- Support React v17. ([3a4c547](https://github.com/milesj/boost/commit/3a4c547))

#### 🐞 Fixes

- Fix `fetchPackageLatestVersion` failing when theres no internet connection. ([da86c1e](https://github.com/milesj/boost/commit/da86c1e))

#### 📦 Dependencies

- **[ink]** Update to v3.2. ([eeb5ee5](https://github.com/milesj/boost/commit/eeb5ee5))

#### 🛠 Internals

- Bump versions to an alpha v3 release. ([942d4c4](https://github.com/milesj/boost/commit/942d4c4))
- Defer React and Ink imports. ([10f4304](https://github.com/milesj/boost/commit/10f4304))
- Migrate to standard require. ([efd526e](https://github.com/milesj/boost/commit/efd526e))

**Note:** Version bump only for package @boost/cli





### 2.11.2 - 2021-08-22

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([4e63a11](https://github.com/milesj/boost/commit/4e63a11))

#### 📘 Docs

- Add API links to each readme. ([80cc65f](https://github.com/milesj/boost/commit/80cc65f))
- Add TypeDoc API integration. (#157) ([ca6ac4b](https://github.com/milesj/boost/commit/ca6ac4b)), closes [#157](https://github.com/milesj/boost/issues/157)
- Fix broken badge images. ([ed85a88](https://github.com/milesj/boost/commit/ed85a88))

**Note:** Version bump only for package @boost/cli





### 2.11.1 - 2021-07-15

**Note:** Version bump only for package @boost/cli





## 2.11.0 - 2021-07-14

#### 🚀 Updates

- Improve CLI startup time and performance. (#156) ([7212c5f](https://github.com/milesj/boost/commit/7212c5f)), closes [#156](https://github.com/milesj/boost/issues/156)

#### 🐞 Fixes

- Fix infinite render caused by useProgram. ([537d5e3](https://github.com/milesj/boost/commit/537d5e3))

**Note:** Version bump only for package @boost/cli





### 2.10.5 - 2021-07-12

#### 📦 Dependencies

- **[execa]** Update to v5.1. ([021bf27](https://github.com/milesj/boost/commit/021bf27))
- **[packemon]** Update to v1. (#151) ([7ffd612](https://github.com/milesj/boost/commit/7ffd612)), closes [#151](https://github.com/milesj/boost/issues/151)
- Update minor and patch versions. ([9b2cb32](https://github.com/milesj/boost/commit/9b2cb32))

#### 🛠 Internals

- Migrate to Beemo tooling. (#154) ([0cd2a6f](https://github.com/milesj/boost/commit/0cd2a6f)), closes [#154](https://github.com/milesj/boost/issues/154)

**Note:** Version bump only for package @boost/cli





### 2.10.4 - 2021-03-26

#### 🐞 Fixes

- Resolve circular reference caused by sub-command proxies. (#147) ([79054b6](https://github.com/milesj/boost/commit/79054b6)), closes [#147](https://github.com/milesj/boost/issues/147)

**Note:** Version bump only for package @boost/cli





### 2.10.3 - 2021-03-26

#### 🐞 Fixes

- Dont format patched console messages. (#144) ([456a25e](https://github.com/milesj/boost/commit/456a25e)), closes [#144](https://github.com/milesj/boost/issues/144)
- Use Ink's native console patching. (#146) ([1a91760](https://github.com/milesj/boost/commit/1a91760)), closes [#146](https://github.com/milesj/boost/issues/146)

#### 📦 Dependencies

- **[packemon]** Update to v0.14. (#145) ([9897e2a](https://github.com/milesj/boost/commit/9897e2a)), closes [#145](https://github.com/milesj/boost/issues/145)

**Note:** Version bump only for package @boost/cli





### 2.10.2 - 2021-02-21

**Note:** Version bump only for package @boost/cli





### 2.10.1 - 2021-02-18

**Note:** Version bump only for package @boost/cli





## 2.10.0 - 2021-02-12

#### 🚀 Updates

- Add boostrap argument to Program#run() and runAndExit(). ([c9bca9a](https://github.com/milesj/boost/commit/c9bca9a))

**Note:** Version bump only for package @boost/cli





### 2.9.1 - 2021-02-08

#### 🛠 Internals

- Sort type hints and aliases. ([1c49e33](https://github.com/milesj/boost/commit/1c49e33))

**Note:** Version bump only for package @boost/cli





## 2.9.0 - 2021-01-16

#### 🚀 Updates

- Add `Command#render` to render components continuously. (#136) ([999f20d](https://github.com/milesj/boost/commit/999f20d)), closes [#136](https://github.com/milesj/boost/issues/136)
- Migrate to Packemon for package building. (#135) ([1a0e9d8](https://github.com/milesj/boost/commit/1a0e9d8)), closes [#135](https://github.com/milesj/boost/issues/135)

#### 🐞 Fixes

- Improve deep inheritance static pollution. ([e87bbba](https://github.com/milesj/boost/commit/e87bbba))

**Note:** Version bump only for package @boost/cli





### 2.8.2 - 2020-12-21

**Note:** Version bump only for package @boost/cli





### 2.8.1 - 2020-12-14

#### 🐞 Fixes

- Display default value alongside choices. ([c05edbe](https://github.com/milesj/boost/commit/c05edbe))
- Dont include default label in choices list. ([909e3a3](https://github.com/milesj/boost/commit/909e3a3))
- Fix command option prototype pollution when using decorators. ([d20a94b](https://github.com/milesj/boost/commit/d20a94b))
- Fix missing default values for help menu. ([5043306](https://github.com/milesj/boost/commit/5043306))
- Move global options to a separate file for reference checks. ([cec8ed9](https://github.com/milesj/boost/commit/cec8ed9))

**Note:** Version bump only for package @boost/cli





## 2.8.0 - 2020-12-07

#### 🚀 Updates

- Add `useIsMounted` hook. ([a548841](https://github.com/milesj/boost/commit/a548841))
- Add `useRenderLoop` hook. ([e7d767c](https://github.com/milesj/boost/commit/e7d767c))

#### 🐞 Fixes

- Handle default selected value. ([44edd86](https://github.com/milesj/boost/commit/44edd86))
- **[Confirm]** Log errors to the console instead of exiting. ([0fe989e](https://github.com/milesj/boost/commit/0fe989e))
- Allow React nodes for most label props. ([2bdb485](https://github.com/milesj/boost/commit/2bdb485))
- Remove list measurement as it doesnt work correctly. ([1e8f328](https://github.com/milesj/boost/commit/1e8f328))
- **[Select]** Add space bar selection handling. ([b443ee0](https://github.com/milesj/boost/commit/b443ee0))
- Differentiate Select and MultiSelect icons. ([8ebd9cd](https://github.com/milesj/boost/commit/8ebd9cd))
- Only render children when component is focused. ([2d47732](https://github.com/milesj/boost/commit/2d47732))
- Remove submitted check from prompt children. ([6079d18](https://github.com/milesj/boost/commit/6079d18))
- Update focus after a succesful submit. ([c465535](https://github.com/milesj/boost/commit/c465535))

#### 📘 Docs

- Add image examples. ([42808b8](https://github.com/milesj/boost/commit/42808b8))

#### 📦 Dependencies

- **[execa]** Update to v5. ([85b2913](https://github.com/milesj/boost/commit/85b2913))
- **[semver]** Update to latest. ([83c4ccc](https://github.com/milesj/boost/commit/83c4ccc))

**Note:** Version bump only for package @boost/cli





## 2.7.0 - 2020-11-29

#### 🚀 Updates

- Add `Confirm` prompt component. (#122) ([e5ec1af](https://github.com/milesj/boost/commit/e5ec1af)), closes [#122](https://github.com/milesj/boost/issues/122)
- Add `HiddenInput` and `PasswordInput` prompt components. (#124) ([9f38dca](https://github.com/milesj/boost/commit/9f38dca)), closes [#124](https://github.com/milesj/boost/issues/124)
- Add `info` and `notice` theme color styles. (#120) ([5bc42d8](https://github.com/milesj/boost/commit/5bc42d8)), closes [#120](https://github.com/milesj/boost/issues/120)
- Add `Input` prompt component. (#121) ([3ddda8a](https://github.com/milesj/boost/commit/3ddda8a)), closes [#121](https://github.com/milesj/boost/issues/121)
- Add `Select` and `MultiSelect` prompt components. (#123) ([50540f6](https://github.com/milesj/boost/commit/50540f6)), closes [#123](https://github.com/milesj/boost/issues/123)

#### 🐞 Fixes

- Fix missing newline for debug logs. ([ea6a0d0](https://github.com/milesj/boost/commit/ea6a0d0))

#### 📦 Dependencies

- **[debug]** Update to v4.3. ([e1304ee](https://github.com/milesj/boost/commit/e1304ee))
- Update dev dependencies. Migrate to TypeScript v4.1. ([578d5e3](https://github.com/milesj/boost/commit/578d5e3))

#### 🛠 Internals

- Reorganize components. ([29f9bb4](https://github.com/milesj/boost/commit/29f9bb4))

**Note:** Version bump only for package @boost/cli





## 2.6.0 - 2020-11-12

#### 🚀 Updates

- Add `useProgram` hook. Improve error and exit handling. (#118) ([dbf95b1](https://github.com/milesj/boost/commit/dbf95b1)), closes [#118](https://github.com/milesj/boost/issues/118)

**Note:** Version bump only for package @boost/cli





## 2.5.0 - 2020-11-11

#### 🚀 Updates

- **[Failure]** Add hideStackTrace prop. ([65240f7](https://github.com/milesj/boost/commit/65240f7))

#### 🐞 Fixes

- Dont display stack trace for manual exits. ([7327cee](https://github.com/milesj/boost/commit/7327cee))

**Note:** Version bump only for package @boost/cli





### 2.4.4 - 2020-11-04

#### 🐞 Fixes

- Fix Node binary checks on Windows. ([f0b748f](https://github.com/milesj/boost/commit/f0b748f))

#### 📦 Dependencies

- **[execa]** Update to v4.1. ([9b749ce](https://github.com/milesj/boost/commit/9b749ce))

**Note:** Version bump only for package @boost/cli





### 2.4.3 - 2020-10-27

**Note:** Version bump only for package @boost/cli





### 2.4.2 - 2020-10-23

#### 🐞 Fixes

- Patch console to fix CLI output tearing. (#116) ([d8ed493](https://github.com/milesj/boost/commit/d8ed493)), closes [#116](https://github.com/milesj/boost/issues/116)

#### 📦 Dependencies

- **[ink]** Update to latest. ([e8044db](https://github.com/milesj/boost/commit/e8044db))

**Note:** Version bump only for package @boost/cli





### 2.4.1 - 2020-10-19

#### 🐞 Fixes

- Fix console wrapped arguments not being passed correctly. ([3a66527](https://github.com/milesj/boost/commit/3a66527))

**Note:** Version bump only for package @boost/cli





## 2.4.0 - 2020-10-18

#### 🚀 Updates

- Pass the logger to all middleware. ([0a28bb2](https://github.com/milesj/boost/commit/0a28bb2))

#### 🐞 Fixes

- Dont swallow non-primitive values when console logging. ([f91f432](https://github.com/milesj/boost/commit/f91f432))

**Note:** Version bump only for package @boost/cli





## 2.3.0 - 2020-10-15

#### 🚀 Updates

- Add node requirement and package outdated middleware. ([891bfb3](https://github.com/milesj/boost/commit/891bfb3))

#### 🐞 Fixes

- Pipe wrapped console methods through the CLI logger. ([deb854f](https://github.com/milesj/boost/commit/deb854f))
- **[Style]** Dont apply background color unless inverted. ([ad1e429](https://github.com/milesj/boost/commit/ad1e429))

#### 📦 Dependencies

- Update to latest. ([2a9e503](https://github.com/milesj/boost/commit/2a9e503))

**Note:** Version bump only for package @boost/cli





## 2.2.0 - 2020-10-09

#### 🚀 Updates

- **[Header]** Add margin props. ([bcf8d8e](https://github.com/milesj/boost/commit/bcf8d8e))

**Note:** Version bump only for package @boost/cli





### 2.1.2 - 2020-10-08

#### 📦 Dependencies

- Update all to latest. ([bb04025](https://github.com/milesj/boost/commit/bb04025))

#### 🛠 Internals

- Add shorthand test utils exports. ([eb2d5dc](https://github.com/milesj/boost/commit/eb2d5dc))

**Note:** Version bump only for package @boost/cli





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
