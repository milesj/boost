import React from 'react';
import {
  Argv,
  ArgList,
  Arguments,
  Command as BaseCommandConfig,
  MapOptionConfig,
  MapParamConfig,
  Option,
  OptionConfig,
  OptionConfigMap,
  Param,
  ParamConfig,
  ParamConfigList,
  PrimitiveType,
} from '@boost/args';
import { Logger } from '@boost/log';

export {
  Argv,
  ArgList,
  Arguments,
  Option,
  OptionConfig,
  OptionConfigMap,
  Param,
  ParamConfig,
  ParamConfigList,
};

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'path' | 'type'>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type StreamType = 'stderr' | 'stdout';

// PROGRAM

export type ExitCode = number;

export type ExitHandler = (message: string, code?: ExitCode) => void;

export interface ProgramOptions {
  banner?: string;
  bin: string;
  footer?: string;
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
  log: Logger;
  program: ProgramOptions;
}

// COMMANDS

export type RunResult = void | undefined | string | React.ReactElement;

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export type Options<T extends object> = MapOptionConfig<Omit<T, keyof GlobalArgumentOptions>>;

export type Params<T extends PrimitiveType[]> = MapParamConfig<T>;

export interface CommandConfig extends BaseCommandConfig {
  options?: OptionConfigMap;
  params?: ParamConfigList;
  path?: string; // Canonical name used on the command line
  rest?: string[];
}

export interface CommandConfigMap {
  [path: string]: CommandConfig;
}

export type CommandStaticConfig = Required<CommandConfig>; // Constructor

export interface CommandMetadata extends CommandStaticConfig {
  commands: { [path: string]: Commandable };
}

export interface CommandMetadataMap {
  [path: string]: CommandMetadata;
}

export interface Commandable<P extends unknown[] = unknown[]> {
  getMetadata(): CommandMetadata;
  getPath(): string;
  register(command: Commandable): this;
  run(...params: P): Promise<RunResult>;
}

// THEMES

export type StyleType = 'default' | 'inverted' | 'failure' | 'muted' | 'success' | 'warning';

export type ThemePalette = { [T in StyleType]: string };