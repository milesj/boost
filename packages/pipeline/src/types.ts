import Context from './Context';

export type Action<Ctx extends Context, Input, Output = Input> = (
  context: Ctx,
  value: Input,
) => Output | Promise<Output>;

export interface AggregatedResult<T> {
  errors: Error[];
  results: T[];
}

export interface Runnable<Input, Output = Input> {
  run<Ctx extends Context>(context: Ctx, value: Input): Promise<Output>;
}

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';
