# Pipelines

Pipe an input through a series of type-safe routines and tasks to produce an output, or simply, run
logic in a series of stages.

## Installation

```
yarn add @boost/pipeline
```

## Events

| Event                    | Arguments                         | Description                                                                     |
| ------------------------ | --------------------------------- | ------------------------------------------------------------------------------- |
| `Pipeline#onRun`         | `input: Input`                    | Called before the pipeline executes work units.                                 |
| `Pipeline#onRunWorkUnit` | `work: WorkUnit, input: Input`    | Called before a single work unit is executed.                                   |
| `Routine#onCommand`      | `command: string, args: string[]` | Called after `execa` was executed.                                              |
| `Routine#onCommandData`  | `command: string, line: string`   | Called while a command is being executed.                                       |
| `WorkUnit#onFail`        | `error: Error | null`             | Called when an execution fails.                                                 |
| `WorkUnit#onPass`        | `output: Output`                  | Called when an execution succeeds.                                              |
| `WorkUnit#onRun`         | `input: Input`                    | Called before a work unit is executed. Can return `true` to skip the work unit. |
| `WorkUnit#onSkip`        | `input: Input`                    | Called when an execution is skipped.                                            |

## Usage

A pipeline can be used to process an input, either in parallel or serial, through a series of
actions known as work units, to produce an output. If you don't need an input, but merely need to
process work in stages, the pipeline supports that as well. There are multiple types of
[work units](#work-types) and [pipelines](#pipeline-types), so choose the best one for each use
case.

To begin, instantiate a pipeline with a [context](#contexts) and input value.

```ts
import { Context, ConcurrentPipeline } from '@boost/pipeline';
import { referenceFunction } from './example';

const input = 123;
const pipeline = new ConcurrentPipeline(new Context(), input);
```

Once instantiated, we must register work units (either a [task](#task) or [routine](#routine)) that
will process the input value, either with `ParallelPipeline#add` or `SerialPipeline#pipe`. All work
units require a descriptive title, and are passed the context and current value when being executed.

```ts
// Tasks
pipeline.add('Task using an anonymous function', (context, value) => value);
pipeline.add('Task using a function reference', referenceFunction);
pipeline.add(new Task('Task using a class instance', referenceFunction));

// Routines
pipeline.add(new ExampleRoutine('key', 'Explicit routine using a class instance'));
```

And to finish, we can execute our pipeline to process each work unit and produce the final output
value.

```ts
const output = await pipeline.run();
```

### Custom Input & Output Types

The input type is inferred from the 2nd constructor argument, while the output type defaults to the
input type. If you need to customize either the input or output type manually, the pipeline generics
can be customized upon instantiation.

```ts
const pipeline = new ConcurrentPipeline<Context, number, string[]>(new Context(), 123);
```

## Contexts

A `Context` is merely a plain class that provides contextual information to all work units, and is
passed as the 1st argument when executing. It's highly encouraged to create custom contexts with
typed properties, helper methods, and more.

```ts
import { Context } from '@boost/pipeline';

export default class ProcessContext extends Context {
  cwd: string;

  root: string;

  constructor(root: string, cwd?: string) {
    this.cwd = cwd || process.cwd();
    this.root = root;
  }
}
```

> A good example of context usage can be found in the
> [Beemo project](https://github.com/beemojs/beemo/tree/master/packages/core/src/contexts).

## Work Types

There are 2 types of work units that can be registered in a pipeline.

### `Task`

A task is simply a function/method (in any form) that accepts an input and returns an output. It can
be represented by a standard function or a `Task` instance.

```ts
import { Context } from '@boost/pipeline';

function task(context: Context, value: number): string {
  return value.toLocaleString();
}

parallelPipeline.add('A title for this task', task);
```

```ts
import { Context, Task } from '@boost/pipeline';

const task = new Task('A title for this task', (context: Context, value: number) =>
  value.toLocaleString(),
);

serialPipeline.pipe(task);
```

### `Routine`

A `Routine` is a specialized work unit implemented with a class. It provides helper methods, the
ability to create nested hierarchical pipelines, and an implicit encapsulation of similar logic and
tasks.

To begin, import the `Routine` class and implement the `Routine#blueprint` and `Routine#execute`
methods. The class requires 3 generics to be defined, starting with an options interface (provide an
empty object if no options needed), an input type, and an output type.

The `Routine#blueprint` method is inherited from [`Contract`](./common.md#contract), and should
return an object that matches the structure of the generic options interface. The `Routine#execute`
method should accept the input type and return the expected output type.

```ts
import { Predicates } from '@boost/common';
import { Routine } from '@boost/pipeline';

interface ExampleOptions {
  limit?: number;
}

type Input = number;
type Output = string;

export default class ExampleRoutine extends Routine<ExampleOptions, Input, Output> {
  blueprint({ number }: Predicates) {
    return {
      limit: number(10),
    };
  }

  async execute(context: Context, value: Input): Promise<Output> {
    return this.createWaterfallPipeline(context, value)
      .pipe(
        'Rounding to cents',
        this.roundToCents,
      )
      .pipe(
        'Converting to readable format',
        this.makeReadable,
      )
      .pipe(
        'Adding currency',
        this.addCurrency,
      )
      .run();
  }

  roundToCents(context: Context, value: number): number {
    return Number(value.toFixed(2));
  }

  makeReadable(context: Context, value: number): string {
    return value.toLocaleString();
  }

  addCurrency(context: Context, value: string): string {
    return `$${value}`;
  }
}
```

When instantiating a routine, a unique key and title must be provided, both of which are primarily
used for streaming to a console. An options object can be passed as the 3rd argument.

```ts
new ExampleRoutine('key', 'Custom title here', { limit: 5 });
```

#### Creating Hierarchical Pipelines

The most prominent feature of `Routine` is the ability to create hierarchical pipelines that can be
nested or executed in any fashion. This can be achieved with the `Routine#createAggregatedPipeline`,
`createConcurrentPipeline`, `createPooledPipeline`, and `createWaterfallPipeline` methods, all of
which require a [context](#contexts) and an initial value.

```ts
async execute(context: Context, items: Item[]): Promise<Item[]> {
  return this.createConcurrentPipeline(context, [])
    .add('Load items from cache', this.loadItemsFromCache)
    .add('Fetch remote items', this.fetchItems)
    .add('Sort and enqueue items', () => {
      return this.createWaterfallPipeline(context, items)
        .pipe(new SortRoutine('sort', 'Sorting items'))
        .pipe(new QueueRoutine('queue', 'Enqueueing items'))
        .run(),
    })
    .run();
}
```

The `Routine#depth` property denotes the current depth within the hierarchy tree, while
`Routine#index` is the current index amongst all work at the same depth.

#### Executing Local Binaries

The `Routine#executeCommand` method can be used to execute binaries and commands on the host machine
(it uses [execa](https://github.com/sindresorhus/execa) under the hood). This is extremely useful
for executing locally installed NPM/Yarn binaries.

```ts
async execute(context: Context): Promise<string> {
  return this.executeCommand('babel', ['./src', '--out-dir', './lib'], { preferLocal: true }).then(
    result => result.stdout,
  );
}
```

## Pipeline Types

There are 4 types of pipelines, grouped into parallel and serial based patterns.

### Parallel

Parallel pipelines register work units with `ParallelPipeline#add`, and process the work units in
parallel when executing `ParallelPipeline#run`.

#### `ConcurrentPipeline`

Executes all work units in parallel, and returns a list of values once all resolve. If an error
occurs, the pipeline will be interrupted.

```ts
import { Context, ConcurrentPipeline } from '@boost/pipeline';

const pipeline = new ConcurrentPipeline(new Context(), initialValue)
  .add('First task', doSomething)
  .add('Second task', anotherSomething)
  .add('Final task', finalSomething);

const values = await pipeline.run();
```

> This pipeline will run _all_ work units at once. If there are far too many work units, it may
> degrade performance. In that case, use [PooledPipeline](#pooledpipeline) instead.

#### `AggregatedPipeline`

Executes all work units in parallel _without_ interruption, and returns an object with a list of
`errors` and `results` once all resolve.

```ts
import { Context, AggregatedPipeline } from '@boost/pipeline';

const pipeline = new AggregatedPipeline(new Context(), initialValue)
  .add('First task', doSomething)
  .add('Second task', anotherSomething)
  .add('Final task', finalSomething);

const { errors, results } = await pipeline.run();
```

> Like `ConcurrentPipeline`, all work units are ran at once. For performance improvements, use
> [PooledPipeline](#pooledpipeline) when dealing with a large number of work units.

#### `PooledPipeline`

Executes a distinct set of work units in parallel _without_ interruption, based on a max concurrency
limit, until all work units have ran. Returns an object with a list of `errors` and `results` once
all resolve.

```ts
import { Context, PooledPipeline } from '@boost/pipeline';

const pipeline = new PooledPipeline(new Context(), initialValue)
  .add('First task', doSomething)
  .add('Second task', anotherSomething)
  .add('Final task', finalSomething);

const { errors, results } = await pipeline.run();
```

##### Options

The following options can be passed as a 3rd argument to `PooledPipeline`.

- `concurrency` (`number`) - How many work units to process in parallel. Defaults to the number of
  CPUs.
- `filo` (`boolean`) - Process with first-in-last-out (FILO) order, instead of first-in-first-out
  (FIFO). Defaults to `false`.
- `timeout` (`number`) - Timeout in milliseconds that each work unit may run, or `0` to avoid a
  timeout. Defaults to `0`.

### Serial

Serial pipelines register work units in a sequence with `SerialPipeline#pipe`, and process the work
units one by one when executing `SerialPipeline#run`.

#### `WaterfallPipeline`

Executes each work unit one by one, with the return value of the previous work unit being passed as
a value argument to the next work unit. Returns the final value once all resolve.

```ts
import { Context, WaterfallPipeline } from '@boost/pipeline';

const pipeline = new WaterfallPipeline(new Context(), 1000)
  .pipe(
    'Multiply initial value',
    (ctx, value) => value * 3,
  )
  .pipe(
    'Convert to a readable string',
    (ctx, value) => value.toLocaleString(),
  )
  .pipe(
    'Convert to an array for reasons unknown',
    (ctx, value) => [value],
  );

const finalValue = await pipeline.run(); // ['3,000']
```
