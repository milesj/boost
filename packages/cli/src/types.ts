import React from 'react';
import { Command as CommandConfig, OptionConfigMap, ParamConfigList } from '@boost/args';

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

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

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export interface CommandConstructorMetadata extends Required<Omit<CommandConfig, 'usage'>> {
  path: string; // Canonical name used on the command line
  usage: string | string[];
}

export interface CommandMetadata extends CommandConstructorMetadata {
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
  run(...params: P): Promise<string | React.ReactElement>;
}
