/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-use-before-define */

import type Promise from 'bluebird';
import type Task from './Task';

export type PrimitiveType = string | number | boolean;

export type ConfigValue = PrimitiveType | PrimitiveType[] | Config;

export type Config = { [key: string]: ConfigValue };

export type ToolConfig = {
  debug?: boolean,
  dry?: boolean,
  extends?: string | string[],
  plugins?: string[],
  [key: string]: ConfigValue,
};

export type PackageConfig = {
  name: string,
  version: string,
  [key: string]: ConfigValue,
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
