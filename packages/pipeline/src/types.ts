import type { Context } from './Context';
import type { Pipeline } from './Pipeline';
import type { WorkUnit } from './WorkUnit';

export type Action<Ctx extends Context, Input = unknown, Output = Input> = (
	context: Ctx,
	value: Input,
	workUnit: AnyWorkUnit,
) => Output | Promise<Output>;

export interface AggregatedResult<T> {
	errors: Error[];
	results: T[];
}

export interface Hierarchical {
	depth: number;
	id: string;
	index: number;
}

export interface Runnable<Input, Output> {
	run: (context: Context, value: Input) => Promise<Output>;
}

export type Status = 'failed' | 'passed' | 'pending' | 'running' | 'skipped';

// Any is required for monitoring events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPipeline = Pipeline<{}, Context, any, any>;

// Any is required for event tuples
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWorkUnit = WorkUnit<{}, any, any>;
