/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';
import type Reporter from './Reporter';
import type Task from './Task';

export type ToolConfig = {
  debug: boolean,
  extends: string | string[],
  silent: boolean,
  [key: string]: *,
};

export type ToolOptions = {
  appName: string,
  pluginName: string,
  reporter: Reporter<*>,
  root: string,
  scoped: boolean,
  title: string,
};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type Result = *;

export type ResultPromise = Promise<Result>;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskCallback<Tx: Object> = (value: Result, context: Tx) => Result | ResultPromise;

export type TasksLoader<Tx: Object> = () => Task<*, Tx>[];

export type EventArguments = *[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
