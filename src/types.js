/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type Task from './Task';

export type ToolConfig = {
  debug: boolean,
  extends: string | string[],
  plugins: string[],
  reporter: string,
  silent: boolean,
  [key: string]: *,
};

export type ToolOptions = {
  appName: string,
  pluginAlias: string,
  root: string,
  scoped: boolean,
  title: string,
};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type ReportLoader = () => {
  debugs: string[],
  errors: string[],
  logs: string[],
  tasks: Task<Object, Object>[],
};

export type ReporterOptions = {
  refreshRate: number,
};

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskAction<Tx: Object> = (value: *, context: Tx) => Promise<*>;

export type EventArguments = *[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
