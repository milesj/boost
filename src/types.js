/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import type Task from './Task';

export type Primitive = string | number | boolean;

export type Config = Object;

export type ToolConfig = {
  debug?: boolean,
  dry?: boolean,
  extends?: string | string[],
  [key: string]: *,
};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type CommandOptions = {
  options: { [opt: string]: Primitive },
  [arg: string]: Primitive | Primitive[],
};

export type Result = *;

export type ResultPromise = Promise<Result>;

export type ResultAccumulator<T> = (value: Result, item: T) => ResultPromise;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskCallback = (value: Result) => Result | ResultPromise;

export type TasksLoader = () => Task[];

export type EventArguments = *[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
