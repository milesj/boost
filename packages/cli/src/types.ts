import { ParamConfig, OptionConfig } from '@boost/args/src';

export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

export interface CLIOptions {
  bin: string;
  name: string;
  version: string;
}

export interface GlobalArgumentOptions {
  help: boolean;
  locale: string;
  version: boolean;
}

export interface CommandMetadata {
  commands: { [name: string]: Commandable };
  name: string;
  options: { [property: string]: OptionConfig };
  params: { config: ParamConfig[]; property: string } | undefined;
  rest: string; // Property name
}

export interface Commandable {
  execute(): Promise<void>;
  getMetadata(): CommandMetadata;
}
