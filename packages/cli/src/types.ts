// Some `any` is used so that its easier for consumers
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
	ArgList,
	Arguments,
	Argv,
	Category,
	Command as BaseCommandConfig,
	Flag,
	ListType,
	MapOptionConfig,
	MapParamConfig,
	MultipleOption,
	Option,
	OptionConfig,
	OptionConfigMap,
	Param,
	ParamConfig,
	ParamConfigList,
	ParserOptions,
	PrimitiveType,
	ScalarType,
	SingleOption,
	UnknownOptionMap,
	ValueType,
} from '@boost/args';
import { Loggable, LoggerFunction } from '@boost/log';
import { INTERNAL_INITIALIZER } from './constants';

export type {
	ArgList,
	Arguments,
	Argv,
	Category,
	Flag,
	ListType,
	MultipleOption,
	Option,
	OptionConfig,
	OptionConfigMap,
	Param,
	ParamConfig,
	ParamConfigList,
	ParserOptions,
	PrimitiveType,
	ScalarType,
	SingleOption,
	UnknownOptionMap,
	ValueType,
};

export type PartialConfig<T> = Omit<T, 'description' | 'multiple' | 'path' | 'type'>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface GlobalOptions {
	help: boolean;
	locale: string;
	version: boolean;
}

export type Options<T extends object> = MapOptionConfig<Omit<T, keyof GlobalOptions>>;

export type Params<T extends PrimitiveType[]> = MapParamConfig<T>;

export type Categories = Record<string, Category | string>;

// PROGRAM

export type ExitCode = number;

export type ExitHandler = (error?: Error | string, code?: ExitCode) => void;

export interface ProgramOptions {
	/** A large banner to appear at the top of the index help interface. */
	banner?: string;
	/** The name of the binary consumers enter on the command line. Must be in kebab-case. */
	bin: string;
	/** The character(s) displayed before command line usage examples. */
	delimiter?: string;
	/** A string of text to display at the bottom of the index help interface. */
	footer?: string;
	/** A string of text to display at the top of the index help interface, below the banner (if present). */
	header?: string;
	/** A human readable name for your program. */
	name: string;
	/** Current version of your CLI program. Typically the version found in your `package.json`. This is output when `--version` is passed. */
	version: string;
}

export interface ProgramStreams {
	stderr: NodeJS.WriteStream;
	stdin: NodeJS.ReadStream;
	stdout: NodeJS.WriteStream;
}

export interface ProgramContextType {
	exit: ExitHandler;
	log: LoggerFunction;
	program: ProgramOptions;
}

export type ProgramBootstrap = () => Promise<void> | void;

// COMMANDS

export type RunResult = React.ReactElement | string | undefined | void;

export type CommandPath = string;

export interface CommandConfig extends BaseCommandConfig {
	/** A list of aliased paths. Will not show up in the help menu, but will match on the command line. */
	aliases?: string[];
	/** Allow unknown options to be parsed, otherwise an error is thrown. Defaults to `false`. */
	allowUnknownOptions?: boolean;
	/** Allow variadic params to be parsed, otherwise an error is thrown. Defaults to `false`. */
	allowVariadicParams?: boolean | string;
	/** A mapping of sub-command and option categories for this command only. Global options are automatically defined under the `global` category. */
	categories?: Categories;
	/** A mapping of options to their configurations. */
	options?: OptionConfigMap;
	/** A list of param (positional args) configurations. */
	params?: ParamConfigList;
	/** A unique name in which to match the command on the command line amongst a list of arguments (argv). */
	path?: CommandPath; // Canonical name used on the command line
}

export type CommandConfigMap = Record<string, CommandConfig>;

export interface OptionInitializer {
	[INTERNAL_INITIALIZER]: boolean;
	register: (command: Commandable, property: string) => void;
	value: unknown;
}

// Constructor
export interface CommandStaticConfig extends Required<CommandConfig> {
	hasRegisteredOptions?: string;
}

export interface CommandMetadata extends CommandStaticConfig {
	commands: Record<string, Commandable>;
}

export type CommandMetadataMap = Record<string, CommandMetadata>;

export interface Commandable<O extends object = any, P extends PrimitiveType[] = any[]> {
	createHelp: () => Promise<React.ReactElement | string>;
	getMetadata: () => CommandMetadata;
	getParserOptions: () => ParserOptions<O, P>;
	getPath: () => CommandPath;
	render: (element: React.ReactElement) => Promise<void>;
	run: (...params: P) => Promise<RunResult> | RunResult;
}

// TASKS

export type TaskContext<O extends GlobalOptions = GlobalOptions> = O & {
	exit: ExitHandler;
	log: LoggerFunction;
	rest: string[];
	unknown: UnknownOptionMap;
	// Methods
	runProgram: (argv: Argv) => Promise<ExitCode>;
	runTask: <A extends unknown[], R>(task: (this: TaskContext<O>, ...args: A) => R, ...args: A) => R;
};

// MIDDLEWARE

export type MiddlewareArguments = Arguments<GlobalOptions, ArgList>;

export type MiddlewareCallback = (argv: Argv) => MiddlewareArguments | Promise<MiddlewareArguments>;

export type Middleware = (
	argv: Argv,
	parse: MiddlewareCallback,
	logger: Loggable,
) => MiddlewareArguments | Promise<MiddlewareArguments>;

// THEMES

export type StyleType =
	| 'default'
	| 'failure'
	| 'info'
	| 'inverted'
	| 'muted'
	| 'notice'
	| 'success'
	| 'warning';

export type ThemePalette = { [T in StyleType]: string };
