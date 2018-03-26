/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Blueprint, Struct } from 'optimal';
import { TaskInterface } from './Task';

export type Partial<T> = { [P in keyof T]?: T[P] };

export interface Context {
  [key: string]: any;
}

export interface ConsoleOptions extends Struct {
  footer: string;
  header: string;
  silent: boolean;
}

export interface ToolConfig extends Struct {
  debug: boolean;
  extends: string | string[];
  plugins: string[];
  reporter: string;
  silent: boolean;
  [key: string]: any;
}

export interface ToolOptions extends Struct {
  appName: string;
  configBlueprint: Blueprint;
  configFolder: string;
  extendArgv: string;
  footer: string;
  header: string;
  pluginAlias: string;
  root: string;
  scoped: boolean;
}

export interface PackageConfig extends Struct {
  name: string;
}

export interface ReportParams {
  errors: string[];
  footer: string;
  header: string;
  logs: string[];
  silent: boolean;
  tasks: TaskInterface[];
}

export type ReportLoader = () => ReportParams;

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type EventArguments = any[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
