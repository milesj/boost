/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Blueprint, Struct } from 'optimal';
import { TaskInterface } from './Task';

export interface Context {
  [key: string]: any;
}

export interface PluginConfig {
  plugin: string;
  [key: string]: any;
}

export interface ReporterConfig {
  reporter: string;
  [key: string]: any;
}

export interface ToolConfig extends Struct {
  debug: boolean;
  extends: string | string[];
  plugins: (string | PluginConfig)[];
  reporter: string | ReporterConfig;
  silent: boolean;
  [key: string]: any;
}

export interface ToolOptions extends Struct {
  appName: string;
  configBlueprint: Blueprint;
  configFolder: string;
  extendArgv: string;
  footer: string;
  pluginAlias: string;
  root: string;
  scoped: boolean;
  workspaceRoot: string;
}

export interface PackageConfig extends Struct {
  name: string;
}

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export type EventArguments = any[];

export type EventListener = (...args: EventArguments) => void;

export type EventNextHandler = (index: number, ...args: EventArguments) => void;
