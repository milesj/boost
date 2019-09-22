export type Argv = string[];

export type ArgList = string[];

export interface Mapping {
  [name: string]: string;
}

export interface Arguments<T extends object = {}> {
  mapping: Mapping;
  options: T;
  positionals: ArgList;
  rest: ArgList;
}

export type ArgumentOptions<T extends object = {}> = {
  [K in keyof T]: T[K] extends boolean
    ? Flag
    : T[K] extends number[]
    ? MultipleOption<number>
    : T[K] extends number
    ? SingleOption<number>
    : T[K] extends string[]
    ? MultipleOption<string>
    : T[K] extends string
    ? SingleOption<string>
    : never;
};

export type ArgumentPositionals = Positional[];

export type ValueType = boolean | number | number[] | string | string[];

export interface ValueMap {
  [key: string]: ValueType;
}

export type OptionType = 'boolean' | 'number' | 'string';

export interface Option<T> {
  description: string;
  short?: ShortOptionName;
  usage?: string;
  type: T extends boolean ? 'boolean' : T extends number ? 'number' : 'string';
}

export interface SingleOption<T> extends Option<T> {
  choices?: T[];
  default?: T;
}

export interface MultipleOption<T> extends Option<T> {
  default?: T[];
  multiple: true;
}

export type Flag = SingleOption<boolean>;

export type OptionConfig = Option<boolean | number | string> & {
  choices?: unknown[];
  default?: ValueType;
  multiple?: boolean;
};

export interface Positional {
  description: string;
  label: LongOptionName;
  required?: boolean;
  usage?: string;
}

export interface Scope {
  config: OptionConfig;
  flag: boolean;
  name: LongOptionName;
  negated: boolean;
  value: ValueType;
}

// Without leading "--"
export type LongOptionName = string;

// Without leading "-"
export type ShortOptionName =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
