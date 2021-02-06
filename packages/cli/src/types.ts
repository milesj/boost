// Some `any` is used so that its easier for consumers
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  ArgList,
  Arguments,
  Argv,
  Category,
  Command as BaseCommandConfig,
  Flag,
  ListType,
  MapOptionConfig,
  MapParamConfig,
  MultipleOption,
  Option,
  OptionConfig,
  OptionConfigMap,
  Param,
  ParamConfig,
  ParamConfigList,
  ParserOptions,
  PrimitiveType,
  ScalarType,
  SingleOption,
  UnknownOptionMap,
  ValueType,
} from '@boost/args';
import { Loggable, LoggerFunction } from '@boost/log';

export {
  ArgList,
  Arguments,
  Argv,
  Category,
  Flag,
  ListType,
  MultipleOption,
  Option,
  OptionConfig,
  OptionConfigMap,
  Param,
  ParamConfig,
  ParamConfigList,
  ParserOptions,
  PrimitiveType,
  ScalarType,
  SingleOption,
  UnknownOptionMap,
  ValueType,
};

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'path' | 'type'>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface GlobalOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export type Options<T extends object> = MapOptionConfig<Omit<T, keyof GlobalOptions>>;

export type Params<T extends PrimitiveType[]> = MapParamConfig<T>;

export interface Categories {
  [name: string]: Category | string;
}

// PROGRAM

export type ExitCode = number;

export type ExitHandler = (error?: Error | string, code?: ExitCode) => void;

export interface ProgramOptions {
  banner?: string;
  bin: string;
  delimiter?: string;
  footer?: string;
  header?: string;
  name: string;
  version: string;
}

export interface ProgramStreams {
  stderr: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
}

export interface ProgramContextType {
  exit: ExitHandler;
  log: LoggerFunction;
  program: ProgramOptions;
}

// COMMANDS

export type RunResult = React.ReactElement | string | undefined | void;

export type CommandPath = string;

export interface CommandConfig extends BaseCommandConfig {
  aliases?: string[];
  allowUnknownOptions?: boolean;
  allowVariadicParams?: boolean | string;
  categories?: Categories;
  options?: OptionConfigMap;
  params?: ParamConfigList;
  path?: CommandPath; // Canonical name used on the command line
}

export interface CommandConfigMap {
  [path: string]: CommandConfig;
}

// Constructor
export interface CommandStaticConfig extends Required<CommandConfig> {
  hasRegisteredOptions?: string;
}

export interface CommandMetadata extends CommandStaticConfig {
  commands: { [path: string]: Commandable };
}

export interface CommandMetadataMap {
  [path: string]: CommandMetadata;
}

export interface Commandable<O extends object = any, P extends PrimitiveType[] = any[]> {
  createHelp: () => React.ReactElement | string;
  getMetadata: () => CommandMetadata;
  getParserOptions: () => ParserOptions<O, P>;
  getPath: () => CommandPath;
  render: (element: React.ReactElement) => Promise<void>;
  run: (...params: P) => Promise<RunResult> | RunResult;
}

// PROXY COMMANDS

export interface ProxyCommandConfig<O extends object, P extends PrimitiveType[]>
  extends Omit<CommandConfig, 'options' | 'params' | 'path'> {
  options?: MapOptionConfig<O>;
  params?: MapParamConfig<P>;
}

export type ProxyCommandRunner<O extends object, P extends PrimitiveType[]> = (
  options: O,
  params: P,
  rest: string[],
) => Promise<RunResult> | RunResult;

// TASKS

export type TaskContext<O extends GlobalOptions = GlobalOptions> = O & {
  exit: ExitHandler;
  log: LoggerFunction;
  rest: string[];
  unknown: UnknownOptionMap;
  // Methods
  runProgram: (argv: Argv) => Promise<ExitCode>;
  runTask: <A extends unknown[], R>(task: (this: TaskContext<O>, ...args: A) => R, ...args: A) => R;
};

// MIDDLEWARE

export type MiddlewareArguments = Arguments<GlobalOptions, ArgList>;

export type MiddlewareCallback = (argv: Argv) => MiddlewareArguments | Promise<MiddlewareArguments>;

export type Middleware = (
  argv: Argv,
  parse: MiddlewareCallback,
  logger: Loggable,
) => MiddlewareArguments | Promise<MiddlewareArguments>;

// THEMES

export type StyleType =
  | 'default'
  | 'failure'
  | 'info'
  | 'inverted'
  | 'muted'
  | 'notice'
  | 'success'
  | 'warning';

export type ThemePalette = { [T in StyleType]: string };
