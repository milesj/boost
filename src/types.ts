/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Blueprint } from 'optimal';
import Task from './Task';

export interface ConsoleOptions {
  debug: boolean,
  footer: string,
  header: string,
  silent: boolean,
};

export interface ToolConfig {
  debug: boolean,
  extends: string | string[],
  plugins: string[],
  reporter: string,
  silent: boolean,
  [key: string]: any,
}

export interface ToolOptions {
  appName: string,
  configBlueprint: Blueprint,
  configFolder: string,
  extendArgv: string,
  footer: string,
  header: string,
  pluginAlias: string,
  root: string,
  scoped: boolean,
};

export interface PackageConfig {
  name: string,
  version: string,
  // Add others if we need them
}

export interface ReportParams {
  debug: boolean,
  debugs: string[],
  errors: string[],
  footer: string,
  header: string,
  logs: string[],
  silent: boolean,
  tasks: Task<object, object>[],
}

export type ReportLoader = () => ReportParams;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type TaskAction<Tx> = (value: any, context: Tx) => any | Promise<any>;

export type EventArguments = any[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;

// export type ExecaOptions = {|
//   argv0?: string,
//   cleanup?: boolean,
//   cwd?: string,
//   detached?: boolean,
//   encoding?: string,
//   env?: { [key: string]: string },
//   extendEnv?: boolean,
//   gid?: number,
//   input?: string | Buffer,
//   killSignal?: string | number,
//   localDir?: string,
//   maxBuffer?: number,
//   preferLocal?: boolean,
//   reject?: boolean,
//   shell?: boolean | string,
//   stderr?: string | number | stream$Duplex,
//   stdin?: string | number | stream$Duplex,
//   stdio?: string,
//   stdout?: string | number | stream$Duplex,
//   stripEof?: boolean,
//   sync?: boolean, // Boost
//   timeout?: number,
//   uid?: number,
//   windowsVerbatimArguments?: boolean,
// |};

export interface ConfigBag {
  [key: string]: any,
}

export interface OptionsBag {
  [key: string]: any,
}
