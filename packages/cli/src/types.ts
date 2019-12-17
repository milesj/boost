export type PartialConfig<T> = Omit<T, 'default' | 'description' | 'multiple' | 'type'>;

export interface CLIOptions {
  bin: string;
  name: string;
  version: string;
}

export interface GlobalOptions {
  help: boolean;
  locale: string;
  version: boolean;
}
