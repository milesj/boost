/* eslint-disable @typescript-eslint/no-explicit-any */

export type Argv = string[];

export type ArgList = string[];

export type ListType = number[] | string[];

export type ScalarType = number | string;

export type PrimitiveType = ScalarType | boolean;

export type ValueType = ListType | PrimitiveType;

export type OptionMap = Record<string, ValueType>;

export type UnknownOptionMap = Record<string, string>;

export type AliasMap = Record<string, string>;

/** Determine option based on type. Only primitives are allowed. */
export type InferParamConfig<T> = T extends PrimitiveType ? Param<T> : never;

// This is janky but we don't have mapped array/tuples.
// This assumes no more than 5 typed params, which is usually enough.
export type MapParamConfig<T extends PrimitiveType[]> = T extends [
	infer A,
	infer B,
	infer C,
	infer D,
	infer E,
]
	? [
			InferParamConfig<A>,
			InferParamConfig<B>,
			InferParamConfig<C>,
			InferParamConfig<D>,
			InferParamConfig<E>,
	  ]
	: T extends [infer A, infer B, infer C, infer D]
	? [InferParamConfig<A>, InferParamConfig<B>, InferParamConfig<C>, InferParamConfig<D>]
	: T extends [infer A, infer B, infer C]
	? [InferParamConfig<A>, InferParamConfig<B>, InferParamConfig<C>]
	: T extends [infer A, infer B]
	? [InferParamConfig<A>, InferParamConfig<B>]
	: T extends [infer A]
	? [InferParamConfig<A>]
	: T extends ArgList
	? Param<string>[]
	: never;

// Like the above but for the types themselves.
// If nothing, we just fallback to an array of strings.
export type MapParamType<T extends PrimitiveType[]> = T extends [
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

/** Determine option based on type. */
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

export type ContextFactory = (arg: string, argv: Argv) => ParserOptions<{}> | undefined;

export interface Arguments<O extends object, P extends PrimitiveType[] = ArgList> {
	/** Current running command and sub-commads. Is an array split on ":". */
	command: string[];
	/** List of errors detected during argument parsing. */
	errors: Error[];
	/** Mapping of options to their values passed on the command line (or their default). */
	options: O;
	/** List of parameter values passed on the command line. */
	params: MapParamType<P>;
	/** List of arguments that appear after "--" on the command line. */
	rest: ArgList;
	/** Mapping of unconfigured options to string values. */
	unknown: UnknownOptionMap;
}

export interface ParserSettings {
	/** Enable loose mode parsing. */
	loose?: boolean;
	/** Allow unknown options to be passed. Will be placed in a special `unknown` object. */
	unknown?: boolean;
	/** Allow variadic params to be passed. Will be accumlated after configured params. */
	variadic?: boolean;
}

export interface ParserOptions<O extends object, P extends PrimitiveType[] = ArgList>
	extends ParserSettings {
	/** List of valid commands. Sub-commands should be denoted with ":". */
	commands?: CommandChecker | string[];
	/** Mapping of options to their type and configurations. */
	options: MapOptionConfig<O>;
	/** List of param configurations (in order). */
	params?: MapParamConfig<P>;
}

// BASE TYPES

export interface Config {
	/** Whether the object is deprecated or not. Will display a tag in the help menu. Defaults to `false`. */
	deprecated?: boolean;
	/** A description of what the object is and does. Supports basic markdown for bold, italics, and underline. */
	description: string;
	/** Whether the object should be hidden from the help menu or not. Will still match on the command line. Defaults to `false`. */
	hidden?: boolean;
}

export interface Command extends Config {
	/** The category this object belongs to. Will be used to group in the parent command or program. Defaults to no category. */
	category?: string;
	/** Define one or many usage examples to display in the help menu. */
	usage?: string[] | string;
}

// ARGUMENT TYPES

export type InferArgType<T> = T extends boolean
	? 'boolean'
	: T extends number[] | number
	? 'number'
	: 'string';

export interface Arg<T> extends Config {
	/**
	 * The default value if option not provided on the command line. The value's type
	 * is dependent on the `type` and `multiple` settings. Furthermore, this value defaults
	 * to the following if not defined.
	 *
	 * - A zero (`0`) when type is `number`.
	 * - An empty string (`''`) when type is `string`.
	 * - And `false` when type is `boolean`.
	 */
	default?: T;
	/** An optional function to format the value after parsing. Must return the same type. */
	format?: (value: T) => T;
	/** Expected type of the provided value. When a value is captured from the command line, it will be type casted. */
	type: InferArgType<T>;
	/** An optional function to validate the provided value. */
	validate?: (value: T) => void;
}

export interface Option<T extends ValueType> extends Arg<T> {
	/** A unique key to group options within categories. Couples with the `Category` type. */
	category?: string;
	/** Single character used as a the short option alias. */
	short?: ShortOptionName;
}

export interface SingleOption<T extends ScalarType> extends Option<T> {
	/** Whitelist of acceptable values. */
	choices?: T[];
	/** When found in an option group, increment the value for each occurrence. _(Numbers only)_ */
	count?: T extends number ? true : never;
	default?: T;
}

export interface MultipleOption<T extends ListType> extends Option<T> {
	/** Throw an error unless the list of values satisfy this required length. */
	arity?: number;
	default?: T;
	/** Allow multiple values to be passed. */
	multiple: true;
}

export interface Flag extends Omit<Option<boolean>, 'format' | 'validate'> {
	default?: boolean;
}

export interface Param<T extends PrimitiveType> extends Arg<T> {
	/** Informational label to display in terminal output. */
	label?: string;
	/** Whether the param is required or not. If required and not passed, the
  parser will throw an error. Defaults to `false`. */
	required?: boolean;
}

export interface Category {
	name: string;
	weight?: number;
}

/** Abstract type for easier typing. */
export type OptionConfig = Option<any> & {
	arity?: number;
	choices?: PrimitiveType[];
	count?: boolean;
	default?: ValueType;
	multiple?: boolean;
};

export type OptionConfigMap = Record<string, OptionConfig>;

/** Abstract type for easier typing. */
export type ParamConfig = Param<any>;

export type ParamConfigList = ParamConfig[];

/** Option name without leading "--". */
export type LongOptionName = string;

/** Short option name without leading "-". */
export type ShortOptionName =
	| 'A'
	| 'a'
	| 'B'
	| 'b'
	| 'C'
	| 'c'
	| 'D'
	| 'd'
	| 'E'
	| 'e'
	| 'F'
	| 'f'
	| 'G'
	| 'g'
	| 'H'
	| 'h'
	| 'I'
	| 'i'
	| 'J'
	| 'j'
	| 'K'
	| 'k'
	| 'L'
	| 'l'
	| 'M'
	| 'm'
	| 'N'
	| 'n'
	| 'O'
	| 'o'
	| 'P'
	| 'p'
	| 'Q'
	| 'q'
	| 'R'
	| 'r'
	| 'S'
	| 's'
	| 'T'
	| 't'
	| 'U'
	| 'u'
	| 'V'
	| 'v'
	| 'W'
	| 'w'
	| 'X'
	| 'x'
	| 'Y'
	| 'y'
	| 'Z'
	| 'z';
