/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import debug from 'debug';
import Plugin from './Plugin';
import Reporter from './Reporter';

export interface Debugger extends debug.IDebugger {
  (message: any, ...args: any[]): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
}

export interface PluginConfig {
  plugin: string;
  [key: string]: any;
}

export interface ReporterConfig {
  reporter: string;
  [key: string]: any;
}

export interface ToolConfig {
  debug: boolean;
  extends: string | string[];
  plugins: (string | PluginConfig | Plugin<any>)[];
  reporters: (string | ReporterConfig | Reporter<any>)[];
  settings: { [key: string]: any };
  [key: string]: any;
}

export interface PackageConfig {
  name: string;
  [key: string]: any;
}

export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';

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

export type ColorType = 'default' | 'failure' | 'pending' | 'success' | 'warning';

export type ColorPalette = { [T in ColorType]: Color | string };
