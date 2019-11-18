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

// Determine option based on type. Only primitives are allowed.
export type InferPositionalConfig<T> = T extends PrimitiveType ? Positional<T> : never;

// This is janky but we don't have mapped array/tuples.
// This assumes no more than 5 typed positionals, which is usually enough.
export type MapPositionalConfig<T extends unknown[]> = T extends [
  infer A,
  infer B,
  infer C,
  infer D,
  infer E,
]
  ? [
      InferPositionalConfig<A>,
      InferPositionalConfig<B>,
      InferPositionalConfig<C>,
      InferPositionalConfig<D>,
      InferPositionalConfig<E>,
    ]
  : T extends [infer A, infer B, infer C, infer D]
  ? [
      InferPositionalConfig<A>,
      InferPositionalConfig<B>,
      InferPositionalConfig<C>,
      InferPositionalConfig<D>,
    ]
  : T extends [infer A, infer B, infer C]
  ? [InferPositionalConfig<A>, InferPositionalConfig<B>, InferPositionalConfig<C>]
  : T extends [infer A, infer B]
  ? [InferPositionalConfig<A>, InferPositionalConfig<B>]
  : T extends [infer A]
  ? [InferPositionalConfig<A>]
  : never;

// Like the above but for the types themselves.
// If nothing, we just fallback to an array of primitive types.
export type MapPositionalType<T extends unknown[]> = T extends [
  infer A,
  infer B,
  infer C,
  infer D,
  infer E,
]
  ? [A, B, C, D, E, ...ArgList]
  : T extends [infer A, infer B, infer C, infer D]
  ? [A, B, C, D, ...ArgList]
  : T extends [infer A, infer B, infer C]
  ? [A, B, C, ...ArgList]
  : T extends [infer A, infer B]
  ? [A, B, ...ArgList]
  : T extends [infer A]
  ? [A, ...ArgList]
  : T extends ArgList
  ? ArgList
  : never;

// Determine option based on type.
export type InferOptionConfig<T> = T extends boolean
  ? Flag
  : T extends number[] | string[]
  ? MultipleOption<T>
  : T extends number | string
  ? SingleOption<T>
  : never;

// Map over option types to infer the configs.
export type MapOptionConfig<T extends object> = { [K in keyof T]: InferOptionConfig<T[K]> };

export type CommandChecker = (arg: string) => boolean;

export interface Arguments<O extends object, P extends unknown[]> {
  command: string[];
  errors: Error[];
  options: O;
  positionals: MapPositionalType<P>;
  rest: ArgList;
}

export interface ParserOptions<T extends object, P extends unknown[]> {
  commands?: string[] | CommandChecker;
  options: MapOptionConfig<T>;
  positionals?: MapPositionalConfig<P>;
}

export interface FormatOptions {
  useInlineValues?: boolean;
  useShort?: boolean;
}

// ARGUMENT TYPES

export type InferArgType<T> = T extends boolean
  ? 'boolean'
  : T extends number | number[]
  ? 'number'
  : 'string';

export interface Arg<T> {
  description: string;
  hidden?: boolean;
  usage?: string;
  type: InferArgType<T>;
  validate?: (value: T) => void;
}

export interface Option<T> extends Arg<T> {
  short?: ShortOptionName;
}

export interface SingleOption<T> extends Option<T> {
  choices?: T[];
  count?: boolean;
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
  label: string;
  required?: boolean;
}

// Abstract type for easier typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionConfig = Option<any> & {
  arity?: number;
  choices?: PrimitiveType[];
  count?: boolean;
  default?: ValueType;
  multiple?: boolean;
};

// Abstract type for easier typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PositionalConfig = Positional<any>;

export interface OptionConfigMap {
  [key: string]: OptionConfig;
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
