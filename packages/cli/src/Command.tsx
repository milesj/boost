/* eslint-disable max-classes-per-file, @typescript-eslint/consistent-type-assertions */

import React from 'react';
import execa, { Options as ExecaOptions } from 'execa';
import {
	ArgList,
	Arguments,
	Argv,
	MapParamType,
	OptionConfigMap,
	ParamConfigList,
	ParserOptions,
	PrimitiveType,
	UnknownOptionMap,
} from '@boost/args';
import { Blueprint, Predicates } from '@boost/common';
import { LoggerFunction } from '@boost/log';
import { CLIError } from './CLIError';
import { CommandManager } from './CommandManager';
import { INTERNAL_OPTIONS, INTERNAL_PARAMS, INTERNAL_PROGRAM } from './constants';
import { Config } from './decorators/Config';
import { mapCommandMetadata } from './helpers/mapCommandMetadata';
import { getConstructor } from './metadata/getConstructor';
import { getInheritedCategories } from './metadata/getInheritedCategories';
import { getInheritedOptions } from './metadata/getInheritedOptions';
import { globalOptions } from './metadata/globalOptions';
import { validateConfig } from './metadata/validateConfig';
import { validateOptions } from './metadata/validateOptions';
import { validateParams } from './metadata/validateParams';
import { Program } from './Program';
import {
	Categories,
	Commandable,
	CommandMetadata,
	CommandPath,
	ExitCode,
	ExitHandler,
	GlobalOptions,
	ProxyCommandConfig,
	ProxyCommandRunner,
	RunResult,
	TaskContext,
} from './types';

/**
 * Create a proxy command using itself as the super class.
 */
export function createProxyCommand<O extends GlobalOptions, P extends PrimitiveType[]>(
	path: CommandPath,
	{ description, options, params, ...config }: ProxyCommandConfig<O, P>,
	runner: ProxyCommandRunner<O, P>,
): Command<O, P> {
	@Config(path, description, config)
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	class ProxyCommand extends Command<O, P> {
		run(): Promise<RunResult> | RunResult {
			return runner.call(this, this[INTERNAL_OPTIONS]!, this[INTERNAL_PARAMS]!, this.rest);
		}
	}

	if (options !== undefined) {
		ProxyCommand.options = options;
	}

	if (params !== undefined) {
		ProxyCommand.params = params;
	}

	return new ProxyCommand();
}

export abstract class Command<
		O extends GlobalOptions = GlobalOptions,
		P extends PrimitiveType[] = ArgList,
		Options extends object = {},
	>
	extends CommandManager<Options>
	implements Commandable<O, P>
{
	static aliases: string[] = [];

	static allowUnknownOptions: boolean = false;

	static allowVariadicParams: boolean | string = false;

	static categories: Categories = {};

	static category: string = '';

	static description: string = '';

	static deprecated: boolean = false;

	static hidden: boolean = false;

	static options: OptionConfigMap = globalOptions;

	static params: ParamConfigList = [];

	static path: string = '';

	static usage: string[] | string = '';

	// Args

	/** Value of `--help`, `-h` passed on the command line. */
	help: boolean = false;

	/** Value of `--locale` passed on the command line. */
	locale: string = 'en';

	/** Additional arguments passed after `--` on the command line. */
	rest: string[] = [];

	/** Unknown options passed on the command line. */
	unknown: UnknownOptionMap = {};

	/** Value of `--version`, `-v` passed on the command line. */
	version: boolean = false;

	// Methods

	/** Method to exit the current program, with an optional error code. */
	exit!: ExitHandler;

	/** Method to log to the console using a log level. */
	log!: LoggerFunction;

	// Internals

	/** @internal */
	[INTERNAL_OPTIONS]?: O;

	/** @internal */
	[INTERNAL_PARAMS]?: P;

	/** @internal */
	[INTERNAL_PROGRAM]?: Program;

	constructor(options?: Options) {
		super(options);

		const ctor = getConstructor(this);

		validateConfig(this.constructor.name, {
			aliases: ctor.aliases,
			allowUnknownOptions: ctor.allowUnknownOptions,
			allowVariadicParams: ctor.allowVariadicParams,
			categories: ctor.categories,
			category: ctor.category,
			deprecated: ctor.deprecated,
			description: ctor.description,
			hidden: ctor.hidden,
			path: ctor.path,
			usage: ctor.usage,
		});
		validateOptions(ctor.options);
		validateParams(ctor.params);

		this.onBeforeRegister.listen(this.handleBeforeRegister);
	}

	/**
	 * Validate options passed to the constructor.
	 */
	// Empty blueprint so that sub-classes may type correctly
	blueprint(predicates: Predicates): Blueprint<object> {
		return {};
	}

	/**
	 * Create a React element based on the Help component.
	 */
	async createHelp(): Promise<React.ReactElement> {
		const metadata = this.getMetadata();
		const { Help } = await import('./components/Help');

		return (
			<Help
				categories={metadata.categories}
				commands={mapCommandMetadata(metadata.commands)}
				config={metadata}
				delimiter={this[INTERNAL_PROGRAM]?.options.delimiter}
				header={metadata.path}
				options={metadata.options}
				params={metadata.params}
			/>
		);
	}

	/**
	 * Execute a system native command with the given arguments
	 * and pass the results through a promise. This does *not* execute Boost CLI
	 * commands, use `runProgram()` instead.
	 */
	executeCommand(command: string, args: string[], options: ExecaOptions = {}) /* infer */ {
		const { streams } = this.getProgram();

		return execa(command, args, {
			...streams,
			...options,
		});
	}

	/**
	 * Return the current command class as an arguments object.
	 * Options and params must be parsed first to operate correctly.
	 */
	getArguments(): Arguments<O, P> {
		return {
			command: this.getPath().split(':'),
			errors: [],
			options: (this[INTERNAL_OPTIONS] ?? {}) as O,
			params: (this[INTERNAL_PARAMS] ?? []) as unknown as MapParamType<P>,
			rest: this.rest,
			unknown: this.unknown,
		};
	}

	/**
	 * Validate and return all metadata registered to this command instance.
	 */
	getMetadata(): CommandMetadata {
		const ctor = getConstructor(this);
		const options: OptionConfigMap = {};

		// Since default values for options are represented as class properties,
		// we need to inject the defaults into the argument parsing layer.
		// We can easily do this here and avoid a lot of headache.
		Object.entries(getInheritedOptions(this)).forEach(([option, config]) => {
			options[option] = {
				...config,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				default: this[option as keyof this] ?? config.default,
			};
		});

		return {
			aliases: ctor.aliases,
			allowUnknownOptions: ctor.allowUnknownOptions,
			allowVariadicParams: ctor.allowVariadicParams,
			categories: getInheritedCategories(this),
			category: ctor.category,
			commands: this.commands,
			deprecated: ctor.deprecated,
			description: ctor.description,
			hidden: ctor.hidden,
			options,
			params: ctor.params,
			path: ctor.path,
			usage: ctor.usage,
		};
	}

	/**
	 * Return metadata as options for argument parsing.
	 */
	getParserOptions(): ParserOptions<O, P> {
		const { aliases, allowUnknownOptions, allowVariadicParams, options, params, path } =
			this.getMetadata();

		return {
			commands: [path, ...aliases],
			options,
			params,
			unknown: allowUnknownOptions,
			variadic: Boolean(allowVariadicParams),
		} as ParserOptions<O, P>;
	}

	/**
	 * Return the command path (canonical name on the command line).
	 */
	getPath(): string {
		return getConstructor(this).path;
	}

	/**
	 * Render a React element with Ink and output to the configured streams.
	 */
	async render(element: React.ReactElement) {
		return this.getProgram().renderElement(element);
	}

	/**
	 * Run the program within itself, by passing a custom command and argv list.
	 */
	runProgram = (argv: Argv): Promise<ExitCode> => this.getProgram().run(argv, undefined, true);

	/**
	 * Run a task (function) with the defined arguments and
	 * the current command instance bound to the task's context.
	 */
	runTask = <A extends unknown[], R>(
		task: (this: TaskContext<O>, ...args: A) => R,
		...args: A
	): R => {
		// We dont want tasks to have full access to the command
		// and its methods, so recreate a similar but smaller context.
		const context: TaskContext<O> = {
			exit: this.exit,
			log: this.log,
			rest: this.rest,
			unknown: this.unknown,
			...this[INTERNAL_OPTIONS]!,
			runProgram: this.runProgram,
			runTask: this.runTask,
		};

		return task.apply(context, args);
	};

	/**
	 * Executed when the command is being ran.
	 */
	abstract run(...params: P): Promise<RunResult> | RunResult;

	/**
	 * Create a proxy command using itself as the super class.
	 */
	protected createProxyCommand<PO extends GlobalOptions, PP extends PrimitiveType[]>(
		path: CommandPath,
		config: ProxyCommandConfig<PO, PP>,
		runner: ProxyCommandRunner<PO, PP>,
	): Command<PO, PP> {
		return createProxyCommand(path, config, runner);
	}

	/**
	 * Return the program instance or fail.
	 */
	private getProgram(): Program {
		const program = this[INTERNAL_PROGRAM];

		if (!program) {
			throw new CLIError('COMMAND_NO_PROGRAM');
		}

		return program;
	}

	/**
	 * Verify sub-command is prefixed with the correct path.
	 */
	private handleBeforeRegister = (subPath: CommandPath) => {
		const path = this.getPath();

		if (!subPath.startsWith(path)) {
			throw new CLIError('COMMAND_INVALID_SUBPATH', [subPath, path]);
		}
	};
}
