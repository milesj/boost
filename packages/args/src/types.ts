export type Argv = string[];

export type ArgList = string[];

export interface AliasMap {
  [alias: string]: string;
}

export interface Arguments<T extends object = {}> {
  aliases: AliasMap;
  options: T;
  positionals: ArgList;
  rest: ArgList;
}

export type ArgumentOptions<T extends object = {}> = {
  [K in keyof T]: T[K] extends boolean
    ? Flag
    : T[K] extends number[]
    ? MultipleOption<'number', number>
    : T[K] extends number
    ? SingleOption<'number', number>
    : T[K] extends string[]
    ? MultipleOption<'string', string>
    : T[K] extends string
    ? SingleOption<'string', string>
    : never;
};

export type ArgumentPositionals = Positional[];

export type ValueType = boolean | number | number[] | string | string[];

export type OptionType = 'boolean' | 'number' | 'string';

export interface Option<T extends OptionType> {
  alias?: string;
  description: string;
  usage?: string;
  type: T;
}

export interface SingleOption<T extends OptionType, V> extends Option<T> {
  choices?: V[];
  default?: V;
}

export interface MultipleOption<T extends OptionType, V> extends Option<T> {
  default?: V[];
  multiple: true;
}

export type Flag = SingleOption<'boolean', boolean>;

export type OptionConfig = Option<OptionType> & {
  choices?: ValueType[];
  default?: ValueType;
  multiple?: boolean;
};

export interface Positional {
  description: string;
  label: string;
  required?: boolean;
  usage?: string;
}

export interface Scope {
  config: OptionConfig;
  flag: boolean;
  name: string;
  negated: boolean;
  value: ValueType;
}
