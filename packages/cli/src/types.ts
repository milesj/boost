import React from 'react';
import { Command as CommandConfig, OptionConfigMap, ParamConfigList } from '@boost/args';

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// PROGRAM

export type ExitCode = number;

export interface ProgramOptions {
  banner: string;
  bin: string;
  footer: string;
  name: string;
  version: string;
}

export interface ProgramContext {
  stderr: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
}

// COMMANDS

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export interface CommandStaticConfig extends Required<Omit<CommandConfig, 'usage'>> {
  path: string; // Canonical name used on the command line
  usage: string | string[];
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
  run(...params: P): Promise<undefined | string | React.ReactElement>;
}

// THEMES

export type StyleType = 'default' | 'inverted' | 'failure' | 'muted' | 'success' | 'warning';

export type ThemePalette = { [T in StyleType]: string };
