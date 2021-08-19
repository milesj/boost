/* eslint-disable no-param-reassign, jest/prefer-spy-on */

import React from 'react';
import { render } from 'ink';
import { env } from '@boost/internal';
import { mockLogger } from '@boost/log/test';
import { stripAnsi } from '@boost/terminal';
import { Command, INTERNAL_OPTIONS, INTERNAL_PARAMS, Program } from '.';

import type {
	ExitCode,
	GlobalOptions,
	PrimitiveType,
	ProgramOptions,
	ProgramStreams,
	TaskContext,
} from '.';

export class MockReadStream {
	isTTY = false;
}

export class MockWriteStream {
	append: boolean = false;

	columns: number = 80;

	output: string;

	constructor(append: boolean = false) {
		this.append = append;
		this.output = '';
	}

	write(string: string) {
		if (this.append) {
			this.output += string;
		} else {
			this.output = string;
		}
	}

	get(): string {
		return this.output;
	}

	on() {}

	off() {}
}

/**
 * Returns mocked `stderr`, `stdout`, and `stdin` streams that can be passed to a `Program`.
 * This does not mock all stream functionality, only those required by Boost and Ink.
 *
 * ```ts
 * import { mockStreams } from '@boost/cli/test';
 *
 * const streams = mockStreams();
 * ```
 */
export function mockStreams(append?: boolean): ProgramStreams {
	return {
		stderr: new MockWriteStream(append),
		stdin: new MockReadStream(),
		stdout: new MockWriteStream(append),
	} as unknown as ProgramStreams;
}

/**
 * Returns a `Program` instance with required options pre-filled and streams mocked
 * (unless manually provided).
 *
 * ```ts
 * import { mockProgram } from '@boost/cli/test';
 *
 * const program = mockProgram({ name: 'Example' });
 * ```
 */
export function mockProgram(options?: Partial<ProgramOptions>, streams?: ProgramStreams): Program {
	return new Program(
		{
			bin: 'test',
			name: 'Test',
			version: '0.0.0',
			...options,
		},
		streams ?? mockStreams(),
	);
}

/**
 * Can be used to render a React component with Ink and return the rendered result
 * as a terminal compatible string. If `stripped` is true, it will strip ANSI
 * escape escape sequences.
 *
 * ```tsx
 * import { renderComponent } from '@boost/cli/test';
 * import TestComponent from '../src/components/TestComponent';
 *
 * it('renders a component', async () => {
 * 	expect(await renderComponent(<TestComponent />)).toMatchSnapshot();
 * });
 * ```
 *
 * > As an alternative, we also suggest using the official
 * > [ink-testing-library](https://github.com/vadimdemedes/ink-testing-library).
 */
export async function renderComponent(
	element: React.ReactElement,
	stripped: boolean = false,
): Promise<string> {
	let output = '';

	try {
		const { render: renderAsTest } = await import('ink-testing-library');
		const { lastFrame } = await renderAsTest(element);

		output = lastFrame() ?? '';
	} catch {
		const stdout = new MockWriteStream();

		await render(element, {
			debug: true,
			experimental: true,
			stdout: stdout as unknown as NodeJS.WriteStream,
		});

		output = stdout.get();
	}

	return stripped ? stripAnsi(output) : output;
}

/**
 * Runs a `Command` outside the context of a `Program`, but mimics similar functionality,
 * including React component rendering. Params are required as they're passed to the run method,
 * while options are optional and assume class properties have been defined. Also, the `exit`
 * and `log` methods have been mocked with Jest spies so that they can be asserted.
 *
 * ```ts
 * import { runCommand } from '@boost/cli/test';
 * import TestCommand from '../src/commands/TestCommand';
 *
 * it('runs a command', async () => {
 * 	const command = new TestCommand();
 *
 * 	expect(await runCommand(command, ['foo', 'bar', 'baz'])).toMatchSnapshot();
 * 	expect(command.log).toHaveBeenCalled();
 * });
 * ```
 *
 * > Since there is no `Program` context, any functionality that requires a program will fail. If
 * > needed, use `runProgram()` instead.
 */
export async function runCommand<O extends GlobalOptions, P extends PrimitiveType[]>(
	command: Command<O, P>,
	params: P,
	options?: Partial<O>,
): Promise<string> {
	if (options) {
		Object.assign(command, options);

		// @ts-expect-error Allow overwrite
		command[INTERNAL_OPTIONS] = {
			help: false,
			locale: 'en',
			version: false,
			...options,
		};
	}

	command.exit = jest.fn();
	command.log = mockLogger();
	command[INTERNAL_PARAMS] = params;

	const result = await command.run(...params);

	if (!result || typeof result === 'string') {
		return result ?? '';
	}

	return renderComponent(result);
}

/**
 * Runs a task function outside the context of a `Command`, in complete isolation.
 * A mock command context is provided with standard defaults, and can be customized
 * through the 3rd argument.
 *
 * ```ts
 * import { runTask } from '@boost/cli/test';
 * import testTask from '../src/tasks/testTask';
 *
 * it('runs a task', async () => {
 * 	const context = {
 * 		log: jest.fn(),
 * 	};
 *
 * 	expect(await runTask(testTask, ['foo', 'bar', 'baz'], context)).toMatchSnapshot();
 * 	expect(context.log).toHaveBeenCalled();
 * });
 * ```
 */
export function runTask<A extends unknown[], R, T extends TaskContext>(
	task: (this: T, ...argz: A) => R,
	args: A,
	context?: Partial<T>,
): R {
	const notTestable = (name: string) => () => {
		throw new Error(
			`\`${name}\` is not testable using the \`runTask\` utility. Test using a full program.`,
		);
	};

	const baseContext: TaskContext = {
		exit: jest.fn(),
		help: false,
		locale: 'en',
		log: mockLogger(),
		rest: [] as string[],
		runProgram: notTestable('runProgram'),
		runTask: notTestable('runTask'),
		unknown: {},
		version: false,
	};

	return task.apply(
		{
			...baseContext,
			...context,
		} as T,
		args,
	);
}

/**
 * Runs a `Program` as if it were ran on the command line, including middleware,
 * commands, success and failure states, and more. Utilizes mocked streams to capture
 * and return standard output and ANSI stripped output. Failed runs will not throw
 * and instead will render a failure output.
 *
 * ```ts
 * import { runProgram } from '@boost/cli/test';
 * import Program from '../src/program';
 *
 * it('runs a program', async () => {
 * 	const program = new Program();
 *
 * 	const { code, output } = await runProgram(program, ['cmd', '--foo', '123', 'bar']);
 *
 * 	expect(output).toMatchSnapshot();
 * 	expect(code).toBe(0);
 * });
 * ```
 */
export async function runProgram(
	program: Program,
	argv: string[],
	options: { append?: boolean } = {},
): Promise<{ code: ExitCode; output: string; outputStripped: string }> {
	if (!(program.streams.stderr instanceof MockWriteStream)) {
		program.streams.stderr = new MockWriteStream(options.append) as unknown as NodeJS.WriteStream;
	}

	if (!(program.streams.stdout instanceof MockWriteStream)) {
		program.streams.stdout = new MockWriteStream(options.append) as unknown as NodeJS.WriteStream;
	}

	if (!(program.streams.stdin instanceof MockReadStream)) {
		program.streams.stdin = new MockReadStream() as unknown as NodeJS.ReadStream;
	}

	// Ink async rendering never resolves while testing,
	// as it relies on system signals to "exit".
	// So we set this to flag the renderer to avoid awaiting.
	env('CLI_TEST_ONLY', 'true');

	const code = await program.run(argv);

	env('CLI_TEST_ONLY', null);

	const output =
		(program.streams.stdout as unknown as MockWriteStream).get() +
		(program.streams.stderr as unknown as MockWriteStream).get();

	return {
		code,
		output,
		outputStripped: stripAnsi(output),
	};
}
