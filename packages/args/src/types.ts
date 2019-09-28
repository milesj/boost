export type Argv = string[];

export type ArgList = string[];

export type PrimitiveType = boolean | number | string;

export type ValueType = PrimitiveType | number[] | string[];

export interface OptionMap {
  [key: string]: ValueType;
}

export interface AliasMap {
  [name: string]: string;
}

export interface Arguments<O extends object = {}, P extends unknown[] = ArgList> {
  command: string[];
  errors: Error[];
  options: O;
  positionals: P;
  rest: ArgList;
}

// PARSER

export interface ParserOptions<T extends object = {}> {
  commands?: string[];
  options: { [K in keyof T]: InferOptionConfig<T[K]> };
  positionals?: PositionalConfig[];
}

// ARGUMENT TYPES

export interface Arg<T> {
  description: string;
  hidden?: boolean;
  usage?: string;
  type?: T extends boolean ? 'boolean' : T extends number | number[] ? 'number' : 'string';
  validate?: (value: T) => void;
}

export interface Option<T> extends Arg<T> {
  group?: GroupName;
  short?: ShortOptionName;
}

export interface SingleOption<T> extends Option<T> {
  choices?: T[];
  default?: T;
}

export interface MultipleOption<T> extends Option<T> {
  arity?: number;
  default?: T;
  multiple: true;
}

export interface Flag extends Option<boolean> {
  default?: boolean;
}

export interface Positional<T> extends Arg<T> {
  label: LongOptionName;
  required?: boolean;
}

// Determine option based on type
export type InferOptionConfig<T> = T extends boolean
  ? Flag
  : T extends number[] | string[]
  ? MultipleOption<T>
  : T extends number | string
  ? SingleOption<T>
  : never;

// Abstract type for easier typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionConfig = Option<any> & {
  arity?: number;
  choices?: PrimitiveType[];
  default?: ValueType;
  multiple?: boolean;
};

// Abstract type for easier typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PositionalConfig = Positional<any>;

export interface OptionConfigMap {
  [key: string]: OptionConfig;
}

export type GroupName = string;

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
