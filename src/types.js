/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type Promise from 'bluebird';
import type Task from './Task';

export type Config = Object;

export type ToolConfig = {
  debug?: boolean,
  dry?: boolean,
  extends?: string | string[],
  plugins?: string[],
  [key: string]: string | string[] | number | boolean | Object,
};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type AppConfig = {
  defaultConfig?: Config,
};

export type Result = *;

export type ResultPromise = Promise<Result>;

export type ResultAccumulator<T> = (value: Result, item: T) => ResultPromise;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskCallback = (value: Result) => Result | ResultPromise;

export type TasksLoader = () => Task[];
