# Pipelines

Process data in a pipeline through a series of routines and tasks.

## Installation

```
yarn add @boost/pipeline
```

## Usage

## Work Types

There are 2 types of work units that can be registered in pipelines for processing.

### `Task`

A task is simply a function that accepts an input and returns an output. It can be represented by a
standard function or a `Task` instance.

```ts
function task(context: Context, value: number): string {
  return String(value).toLocaleString();
}

parallelPipeline.add('A title for this task', task);
serialPipeline.pipe(
  'A title for this task',
  task,
);
```

```ts
import { Task } from '@boost/pipeline';

const task = new Task('A title for this task', (context: Context, value: number) =>
  String(value).toLocaleString(),
);

parallelPipeline.add(task);
serialPipeline.pipe(task);
```

### `Routine`

### Custom `WorkUnit`s

## Pipeline Types

There are 4 types of pipelines, grouped into parallel and serial based patterns.

### Parallel

Parallel pipelines register work units with `add()`, and process the work units in parallel when
`run()` is executed.

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

Serial pipelines register work units in order with `pipe()`, and process the work units one by one
when `run()` is executed.

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
    (ctx, value) => String(value).toLocaleString(),
  )
  .pipe(
    'Convert to an array for reasons unknown',
    (ctx, value) => [value],
  );

const finalValue = await pipeline.run(); // ['3,000']
```
