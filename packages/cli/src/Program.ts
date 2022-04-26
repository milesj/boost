import levenary from 'levenary';
import {
	ArgList,
	Arguments,
	Argv,
	parse,
	ParseError,
	parseInContext,
	PrimitiveType,
	ValidationError,
} from '@boost/args';
import { ExitError } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { Event } from '@boost/event';
import { env } from '@boost/internal';
import { createLogger, formats, LoggerFunction, StreamTransport } from '@boost/log';
import { CLIError } from './CLIError';
import { Command } from './Command';
import { CommandManager } from './CommandManager';
import { Wrapper } from './components/internal/Wrapper';
import {
	DELIMITER,
	EXIT_FAIL,
	EXIT_PASS,
	INTERNAL_OPTIONS,
	INTERNAL_PARAMS,
	INTERNAL_PROGRAM,
	VERSION_FORMAT,
} from './constants';
import { isArgvSize } from './helpers/isArgvSize';
import { mapCommandMetadata } from './helpers/mapCommandMetadata';
import { patchDebugModule } from './helpers/patchDebugModule';
import { LogBuffer } from './LogBuffer';
import { getConstructor } from './metadata/getConstructor';
import { removeProcessBin } from './middleware/removeProcessBin';
import { Failure, Help, IndexHelp } from './react';
import { msg } from './translate';
import {
	Categories,
	Commandable,
	CommandPath,
	ExitCode,
	GlobalOptions,
	Middleware,
	MiddlewareArguments,
	MiddlewareCallback,
	ProgramBootstrap,
	ProgramOptions,
	ProgramStreams,
	RunResult,
} from './types';

export class Program extends CommandManager<ProgramOptions> {
	/**
	 * Called after a component has rendered.
	 * @category Events
	 */
	readonly onAfterRender = new Event('after-render');

	/**
	 * Called after the program and command have been ran.
	 * @category Events
	 */
	readonly onAfterRun = new Event<[Error?]>('after-run');

	/**
	 * Called after a command has run but before a component will render.
	 * @category Events
	 */
	readonly onBeforeRender = new Event<[RunResult]>('before-render');

	/**
	 * Called before the program and command will run.
	 * @category Events
	 */
	readonly onBeforeRun = new Event<[Argv]>('before-run');

	/**
	 * Called when a command has been found after parsing argv.
	 * @category Events
	 */
	readonly onCommandFound = new Event<[Argv, CommandPath, Commandable]>('command-found');

	/**
	 * Called when a command wasn't found after parsing argv.
	 * @category Events
	 */
	readonly onCommandNotFound = new Event<[Argv, CommandPath]>('command-not-found');

	/**
	 * Called when the exit() handler is executed but before the process exits.
	 * @category Events
	 */
	readonly onExit = new Event<[string, ExitCode]>('exit');

	/**
	 * Called when the help menu is rendered.
	 * @category Events
	 */
	readonly onHelp = new Event<[CommandPath?]>('help');

	readonly streams: ProgramStreams = {
		stderr: process.stderr,
		stdin: process.stdin,
		stdout: process.stdout,
	};

	protected commandLine: string = '';

	protected logger: LoggerFunction;

	protected middlewares: Middleware[] = [removeProcessBin()];

	protected rendering: boolean = false;

	protected sharedCategories: Categories = {
		global: {
			name: msg('cli:categoryGlobal'),
			weight: 100,
		},
	};

	protected standAlone: CommandPath = '';

	private errBuffer: LogBuffer;

	private outBuffer: LogBuffer;

	constructor(options: ProgramOptions, streams?: ProgramStreams) {
		super(options);

		Object.assign(this.streams, streams);

		// Buffers logs during the Ink rendering process
		this.errBuffer = new LogBuffer(this.streams.stderr);
		this.outBuffer = new LogBuffer(this.streams.stdout);

		// Both logger and global console will write to the buffers
		this.logger = createLogger({
			name: 'cli',
			transports: [
				new StreamTransport({
					format: formats.console,
					levels: ['error', 'trace', 'warn'],
					stream: this.errBuffer,
				}),
				new StreamTransport({
					format: formats.console,
					levels: ['debug', 'info', 'log'],
					stream: this.outBuffer,
				}),
			],
		});

		this.onAfterRegister.listen(this.handleAfterRegister);
		this.onBeforeRegister.listen(this.handleBeforeRegister);
	}

	blueprint(schemas: Schemas): Blueprint<ProgramOptions> {
		const { string } = schemas;

		return {
			banner: string(),
			bin: string().notEmpty().required().kebabCase(),
			delimiter: string(DELIMITER),
			footer: string(),
			header: string(),
			name: string().notEmpty().required(),
			version: string().required().match(VERSION_FORMAT),
		};
	}

	/**
	 * Define option and command categories to supply to the running command,
	 * or the program itself.
	 */
	categories(categories: Categories): this {
		Object.assign(this.sharedCategories, categories);

		return this;
	}

	/**
	 * Register a command and its canonical path as the default command.
	 * A default command should be used when stand-alone binary is required.
	 */
	default(command: Commandable): this {
		if (Object.keys(this.commands).length > 0) {
			throw new CLIError('COMMAND_MIXED_NONDEFAULT');
		}

		this.register(command);
		this.standAlone = command.getPath();

		return this;
	}

	/**
	 * Exit the program with an error code.
	 * Should be called within a command or component.
	 */
	exit = (error?: Error | string, errorCode?: ExitCode) => {
		let message = '';
		let code = errorCode;

		if (error instanceof ExitError) {
			({ message, code } = error);
		} else if (error instanceof Error) {
			({ message } = error);
		} else if (error) {
			message = error;
		}

		if (!code) {
			code = message ? EXIT_FAIL : EXIT_PASS;
		}

		this.onExit.emit([message, code]);

		throw new ExitError(message, code);
	};

	/**
	 * Define a middleware function to apply to the argv list or args object.
	 */
	middleware(middleware: Middleware): this {
		if (typeof middleware !== 'function') {
			throw new CLIError('MIDDLEWARE_INVALID');
		}

		this.middlewares.push(middleware);

		return this;
	}

	/**
	 * Parse the arguments list according to the number of commands that have been registered.
	 */
	parse<O extends GlobalOptions, P extends PrimitiveType[] = ArgList>(argv: Argv): Arguments<O, P> {
		if (Object.keys(this.commands).length === 0) {
			throw new CLIError('COMMAND_NONE_REGISTERED');
		}

		if (this.standAlone) {
			return parse(argv, this.getCommand<O, P>(this.standAlone)!.getParserOptions());
		}

		try {
			return parseInContext(argv, (arg) => this.getCommand<O, P>(arg)?.getParserOptions());
		} catch {
			const possibleCmd = argv.find((arg) => !arg.startsWith('-')) ?? '';

			this.onCommandNotFound.emit([argv, possibleCmd]);

			if (possibleCmd) {
				const closestCmd = levenary(possibleCmd, this.getCommandPaths());

				throw new CLIError('COMMAND_UNKNOWN', [possibleCmd, closestCmd]);
			}

			throw new CLIError('COMMAND_INVALID_RUN');
		}
	}

	/**
	 * Render a React element with Ink and output to the configured streams.
	 */
	async renderElement(element: React.ReactElement) {
		// Do not allow nested renders
		// istanbul ignore next
		if (this.rendering) {
			throw new CLIError('REACT_RENDER_NO_NESTED');
		} else {
			this.rendering = true;
		}

		const { render } = await import('ink');
		const { createElement } = await import('react');
		const { stdin, stdout, stderr } = this.streams;
		const unpatchDebug = patchDebugModule();

		try {
			this.onBeforeRender.emit([element]);

			const output = await render(
				createElement(
					Wrapper,
					{
						children: element,
						errBuffer: this.errBuffer,
						exit: this.exit,
						log: this.logger,
						outBuffer: this.outBuffer,
						program: this.options,
					},
					element,
				),
				{
					debug: process.env.NODE_ENV === 'test',
					exitOnCtrlC: true,
					experimental: true,
					patchConsole: true,
					stderr,
					stdin,
					stdout,
				},
			);

			// This never resolves while testing
			// istanbul ignore next
			if (!env('CLI_TEST_ONLY')) {
				await output.waitUntilExit();
			}

			this.onAfterRender.emit([]);
		} catch (error: unknown) {
			// Never runs while testing
			// istanbul ignore next
			this.exit(error as Error);
		} finally {
			this.rendering = false;
			unpatchDebug();
		}
	}

	/**
	 * Run the program in the following steps:
	 * - Apply middleware to argv list.
	 * - Parse argv into an args object (of options, params, etc).
	 * - Determine command to run, or fail.
	 * - Run command and render output.
	 * - Return exit code.
	 */
	async run(argv: Argv, bootstrap?: ProgramBootstrap, rethrow: boolean = false): Promise<ExitCode> {
		this.onBeforeRun.emit([argv]);

		let exitCode: ExitCode = 0;

		try {
			if (bootstrap) {
				await bootstrap();
			}

			exitCode = await this.runAndRender(argv);

			this.onAfterRun.emit([]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				exitCode = await this.renderErrors([error]);

				this.onAfterRun.emit([error]);

				if (rethrow) {
					throw error;
				}
			}
		}

		return exitCode;
	}

	/**
	 * Run the program and also set the process exit code.
	 */
	// istanbul ignore next
	async runAndExit(argv: Argv, bootstrap?: ProgramBootstrap): Promise<ExitCode> {
		const exitCode = await this.run(argv, bootstrap);

		process.exitCode = exitCode;

		return exitCode;
	}

	/**
	 * Render the index screen when no args are passed.
	 * Should include banner, header, footer, and command (if applicable).
	 */
	protected async createIndex(): Promise<React.ReactElement> {
		const { createElement } = await import('react');

		if (this.standAlone) {
			return createElement(
				IndexHelp,
				this.options,
				await this.getCommand(this.standAlone)!.createHelp(),
			);
		}

		const commands: Record<string, Commandable> = {};

		// Remove sub-commands
		Object.entries(this.commands).forEach(([path, command]) => {
			if (!path.includes(':')) {
				commands[path] = command;
			}
		});

		return createElement(
			IndexHelp,
			this.options,
			createElement(Help, {
				categories: this.sharedCategories,
				commands: mapCommandMetadata(commands),
				delimiter: this.options.delimiter,
				header: msg('cli:labelAbout'),
			}),
		);
	}

	/**
	 * Loop through all middleware to modify the argv list
	 * and resulting args object.
	 */
	protected applyMiddlewareAndParseArgs(
		argv: Argv,
	): MiddlewareArguments | Promise<MiddlewareArguments> {
		let index = -1;

		const next: MiddlewareCallback = (nextArgv) => {
			index += 1;
			const middleware = this.middlewares[index];

			// Keep calling middleware until we exhaust them all
			if (middleware) {
				return middleware(nextArgv, next, this.logger);
			}

			// Otherwise all middleware have ran, so parse the final list
			this.commandLine = nextArgv.join(' ');

			return this.parse(nextArgv);
		};

		return next(argv);
	}

	/**
	 * Render the result of a command's run to the defined stream.
	 * If a string has been returned, write it immediately.
	 * If a React component, render with Ink and wait for it to finish.
	 */
	protected async render(result: RunResult, exitCode: ExitCode = EXIT_PASS): Promise<ExitCode> {
		// For simple strings, ignore react and the buffer
		if (typeof result === 'string') {
			this.streams.stdout.write(`${result}\n`);

			return exitCode;
		}

		if (result) {
			await this.renderElement(result);
		}

		return exitCode;
	}

	/**
	 * Render an error and warnings menu based on the list provided.
	 * If argument parser or validation errors are found, treat them with special logic.
	 */
	protected async renderErrors(errors: Error[]): Promise<ExitCode> {
		const exitError = errors[0];

		if (exitError instanceof ExitError && exitError.code === 0) {
			return exitError.code;
		}

		// eslint-disable-next-line unicorn/prefer-array-find
		const parseErrors = errors.filter((error) => error instanceof ParseError);
		const validErrors = errors.filter((error) => error instanceof ValidationError);
		const error = parseErrors[0] ?? validErrors[0] ?? exitError;

		// Mostly for testing, but useful for other things
		// istanbul ignore next
		if (env('CLI_TEST_FAIL_HARD')) {
			throw error;
		}

		const { createElement } = await import('react');

		return this.render(
			createElement(Failure, {
				binName: this.options.bin,
				commandLine: this.commandLine,
				delimiter: this.options.delimiter,
				error,
				warnings: validErrors.filter((verror) => verror !== error),
			}),
			error instanceof ExitError ? error.code : EXIT_FAIL,
		);
	}

	/**
	 * Internal run that does all the heavy lifting and parsing,
	 * while the public run exists to catch any unexpected errors.
	 */
	protected async runAndRender(argv: Argv): Promise<ExitCode> {
		const showVersion = argv.some((arg) => arg === '-v' || arg === '--version');
		const showHelp = argv.some((arg) => arg === '-h' || arg === '--help');

		// Display index help
		if ((isArgvSize(argv, 0) && !this.standAlone) || (isArgvSize(argv, 1) && showHelp)) {
			this.onHelp.emit([]);

			return this.render(await this.createIndex());
		}

		// Display version
		if (showVersion) {
			return this.render(this.options.version);
		}

		// Parse the arguments
		const {
			command: paths,
			errors,
			options,
			params,
			rest,
			unknown,
		} = await this.applyMiddlewareAndParseArgs(argv);
		const path = paths.join(':') || this.standAlone;
		const command = this.getCommand(path) as Command;

		this.onCommandFound.emit([argv, path, command]);

		// Apply shared categories to command constructor
		Object.assign(getConstructor(command).categories, this.sharedCategories);

		// Display command help
		if (options.help) {
			this.onHelp.emit([path]);

			return this.render(await command.createHelp());
		}

		// Display errors
		if (errors.length > 0) {
			return this.renderErrors(errors);
		}

		// Apply options to command properties
		Object.assign(command, options);

		// Apply remaining arguments and properties
		command.rest = rest;
		command.unknown = unknown;
		command.exit = this.exit;
		command.log = this.logger;
		command[INTERNAL_OPTIONS] = options;
		command[INTERNAL_PARAMS] = params;
		command[INTERNAL_PROGRAM] = this;

		return this.render(await command.run(...params));
	}

	/**
	 * Deeply register all commands so that we can easily access it during parse.
	 */
	private handleAfterRegister = (_path: CommandPath, command: Commandable) => {
		const deepRegister = (cmd: Commandable) => {
			const { aliases, commands, path } = cmd.getMetadata();

			this.commands[path] = cmd;

			aliases.forEach((alias) => {
				this.commandAliases[alias] = path;
			});

			Object.values(commands).forEach(deepRegister);
		};

		deepRegister(command);
	};

	/**
	 * Check for default and non-default command mixing.
	 */
	private handleBeforeRegister = () => {
		if (this.standAlone) {
			throw new CLIError('COMMAND_MIXED_DEFAULT');
		}
	};
}
