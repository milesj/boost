# Pipeline - Boost

![build status](https://img.shields.io/github/workflow/status/milesj/boost/Build)
![npm version](https://img.shields.io/npm/v/@boost/pipeline)

Pipe an input through a series of routines and tasks to produce an output, or simply, run logic in a
series of stages.

<!-- prettier-ignore -->
```ts
import { Context, WaterfallPipeline } from '@boost/pipeline';

const ast = new WaterfallPipeline(new Context(), filePath)
  .pipe('Parsing AST', parseAst)
  .pipe('Linting rules', runLintsOnAst)
  .pipe('Transforming nodes', transformNodesOnAst)
  .pipe('Writing contents', writeAstToFile)
  .run();
```

## Features

- Parallel and serial based processing pipelines.
- Supports 2 types of work units: tasks and routines.
- Pooling and aggregated implementations for computation heavy or complex logic.
- Contextually aware executions.

## Installation

```
yarn add @boost/pipeline
```

## Documentation

- [https://boostlib.dev/docs/pipeline](https://boostlib.dev/docs/pipeline)
- [https://boostlib.dev/api/pipeline](https://boostlib.dev/api/pipeline)
