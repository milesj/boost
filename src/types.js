/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Blueprint } from 'optimal';
import type Task from './Task';

export type ConsoleOptions = {|
  debug: boolean,
  footer: string,
  header: string,
  silent: boolean,
|};

export type ToolConfig = {
  debug: boolean,
  extends: string | string[],
  plugins: string[],
  reporter: string,
  silent: boolean,
  [key: string]: *,
};

export type ToolOptions = {|
  appName: string,
  configBlueprint: Blueprint,
  configFolder: string,
  extendArgv: string,
  footer: string,
  header: string,
  pluginAlias: string,
  root: string,
  scoped: boolean,
|};

export type PackageConfig = {
  name: string,
  version: string,
  // Add others if we need them
};

export type ReportLoader = () => {|
  debug: boolean,
  debugs: string[],
  errors: string[],
  footer: string,
  header: string,
  logs: string[],
  silent: boolean,
  tasks: Task<*, *>[],
|};

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskAction<Tx> = (value: *, context: Tx) => Promise<*>;

export type EventArguments = *[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;

export type ExecaOptions = {|
  argv0?: string,
  cleanup?: boolean,
  cwd?: string,
  detached?: boolean,
  encoding?: string,
  env?: { [key: string]: string },
  extendEnv?: boolean,
  gid?: number,
  input?: string | Buffer,
  killSignal?: string | number,
  localDir?: string,
  maxBuffer?: number,
  preferLocal?: boolean,
  reject?: boolean,
  shell?: boolean | string,
  stderr?: string | number | stream$Duplex,
  stdin?: string | number | stream$Duplex,
  stdio?: string,
  stdout?: string | number | stream$Duplex,
  stripEof?: boolean,
  timeout?: number,
  uid?: number,
  windowsVerbatimArguments?: boolean,
|};

export type ConfigStruct = { [key: string]: * };

export type OptionsStruct = { [key: string]: * };
