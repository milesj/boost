/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable typescript/no-empty-interface */

import debug from 'debug';
import i18next from 'i18next';
import Reporter from './Reporter';

export interface Debugger extends debug.IDebugger {
  (message: any, ...args: any[]): void;
  invariant(condition: boolean, message: string, pass: string, fail: string): void;
}

export interface Translator extends i18next.i18n {}

export type PluginConfigOption<P> = (string | { [key: string]: any } | P)[];

export interface SettingsConfig {
  [key: string]: any;
}

export interface ToolConfig<T = SettingsConfig> {
  debug: boolean;
  extends: string[];
  locale: string;
  output: number;
  reporters: PluginConfigOption<Reporter<any>>;
  settings: T;
  silent: boolean;
  theme: string;
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
