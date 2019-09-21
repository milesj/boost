export type Argv = string[];

export type ArgList = string[];

export interface AliasMap {
  [alias: string]: string;
}

export interface Arguments<T extends object = {}> {
  aliases: AliasMap;
  args: T;
  argv: Argv;
  command: string;
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
  default?: V;
}

export interface MultipleOption<T extends OptionType, V> extends Option<T> {
  default?: V[];
  multiple: true;
}

export type Flag = SingleOption<'boolean', boolean>;

export type OptionConfig = Option<OptionType> & { default?: ValueType; multiple?: boolean };

export interface Positional {
  description: string;
  label: string;
  required?: boolean;
  usage?: string;
}

export interface Scope<T extends object> {
  flag: boolean;
  name: keyof T;
  negated: boolean;
  type: OptionType;
  value: ValueType;
}
