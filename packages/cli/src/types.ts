import React from 'react';
import { Command as CommandConfig, OptionConfigMap, ParamConfigList } from '@boost/args';
import { Logger } from '@boost/log';

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type StreamType = 'stderr' | 'stdout';

// PROGRAM

export type ExitCode = number;

export type ExitHandler = (message: string, code: ExitCode) => void;

export interface ProgramOptions {
  banner: string;
  bin: string;
  footer: string;
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

export type RunResult = undefined | string | React.ReactElement;

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export interface CommandStaticConfig extends Required<CommandConfig> {
  path: string; // Canonical name used on the command line
}

export interface CommandMetadata extends CommandStaticConfig {
  commands: { [path: string]: Commandable };
  options: OptionConfigMap;
  params: ParamConfigList;
  rest: string; // Property name to set rest args to
}

export interface CommandMetadataMap {
  [path: string]: CommandMetadata;
}

export interface Commandable<P extends unknown[] = unknown[]> {
  getMetadata(): CommandMetadata;
  getPath(): string;
  run(...params: P): Promise<RunResult>;
}

// THEMES

export type StyleType = 'default' | 'inverted' | 'failure' | 'muted' | 'success' | 'warning';

export type ThemePalette = { [T in StyleType]: string };
