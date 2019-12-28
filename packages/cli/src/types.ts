import { Command as CommandConfig, OptionConfigMap, ParamConfigList } from '@boost/args/src';

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

export interface ProgramOptions {
  bin: string;
  name: string;
  version: string;
}

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export interface CommandConstructorMetadata extends Required<CommandConfig> {
  path: string; // Canonical name used on the command line
}

export interface CommandMetadata extends CommandConstructorMetadata {
  commands: { [path: string]: Commandable };
  options: OptionConfigMap;
  params: ParamConfigList;
  rest: string; // Property name to set rest args to
}

export interface Commandable<P extends unknown[] = unknown[]> {
  getMetadata(): CommandMetadata;
  getPath(): string;
  run(...params: P): Promise<void>;
}
