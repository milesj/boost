/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import type Task from './Task';

export type ToolConfig = {
  debug?: boolean,
  dry?: boolean,
  extends?: string | string[],
  [key: string]: *,
};

export type ToolOptions = {
  appName: string,
  pluginName: string,
  root: string,
};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type Result = *;

export type ResultPromise = Promise<Result>;

export type ResultAccumulator<T> = (value: Result, item: T) => ResultPromise;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskCallback = (value: Result, context?: Object) => Result | ResultPromise;

export type TasksLoader = () => Task<*>[];

export type EventArguments = *[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
