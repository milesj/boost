/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import debug from 'debug';
import { Blueprint, Struct } from 'optimal';

export interface Debugger extends debug.IDebugger {
  (message: any, ...args: any[]): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
}

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
  [key: string]: any;
}

export interface PackageConfig extends Struct {
  name: string;
}

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

export interface SynchronizedResponse {
  errors: Error[];
  results: any[];
}

export type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';

export type ColorType = 'failure' | 'pending' | 'success' | 'warning';

export type ColorPalette = { [T in ColorType]: Color | string };
