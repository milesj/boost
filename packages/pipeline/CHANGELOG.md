# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
