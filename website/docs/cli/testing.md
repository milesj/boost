---
title: Testing
---

The following [Jest](https://github.com/facebook/jest) utilities are available in the
`@boost/cli/test` module.

## `mockStreams`

> mockStreams(append?: boolean): ProgramStreams

Returns mocked `stderr`, `stdout`, and `stdin` streams that can be passed to a `Program`. This does
not mock all stream functionality, only those required by Boost and Ink.

```ts
import { mockStreams } from '@boost/cli/test';

const streams = mockStreams();
```

## `mockProgram`

> mockProgram(options?: ProgramOptions, streams?: ProgramStreams): Program

Returns a `Program` instance with required options pre-filled and streams mocked (unless manually
provided).

```ts
import { mockProgram } from '@boost/cli/test';

const program = mockProgram({ name: 'Example' });
```

## `renderComponent`

> async renderComponent(element: React.ReactElement, stripped?: boolean): Promise<string\>

Can be used to render a React component with Ink and return the rendered result as a terminal
compatible string. If `stripped` is true, it will strip ANSI escape escape sequences.

```tsx
import { renderComponent } from '@boost/cli/test';
import TestComponent from '../src/components/TestComponent';

it('renders a component', async () => {
	expect(await renderComponent(<TestComponent />)).toMatchSnapshot();
});
```

> As an alternative, we also suggest using the official
> [ink-testing-library](https://github.com/vadimdemedes/ink-testing-library).

## `runCommand`

> async runCommand<O, P\>(command: Command, params: P, options?: O): Promise<string\>

Runs a `Command` outside the context of a `Program`, but mimics similar functionality, including
React component rendering. Params are required as they're passed to the run method, while options
are optional and assume class properties have been defined. Also, the `exit` and `log` methods have
been mocked with Jest spies so that they can be asserted.

```ts
import { runCommand } from '@boost/cli/test';
import TestCommand from '../src/commands/TestCommand';

it('runs a command', async () => {
	const command = new TestCommand();

	expect(await runCommand(command, ['foo', 'bar', 'baz'])).toMatchSnapshot();
	expect(command.log).toHaveBeenCalled();
});
```

> Since there is no `Program` context, any functionality that requires a program will fail. If
> needed, use `runProgram()` instead.

## `runTask`

> runTask<A, R, T extends TaskContext\>(task: (this: T, ...args: A) => R, args: A, context?: T): R

Runs a task function outside the context of a `Command`, in complete isolation. A mock command
context is provided with standard defaults, and can be customized through the 3rd argument.

```ts
import { runTask } from '@boost/cli/test';
import testTask from '../src/tasks/testTask';

it('runs a task', async () => {
	const context = {
		log: jest.fn(),
	};

	expect(await runTask(testTask, ['foo', 'bar', 'baz'], context)).toMatchSnapshot();
	expect(context.log).toHaveBeenCalled();
});
```

## `runProgram`

> async runProgram(program: Program, argv: string[]): Promise<{ code: ExitCode; output: string;
> outputStripped: string }\>

Runs a `Program` as if it were ran on the command line, including middleware, commands, success and
failuer states, and more. Utilizes mocked streams to capture and return standard output and ANSI
stripped output. Failed runs will not throw and instead will render a failure output.

```ts
import { runProgram } from '@boost/cli/test';
import Program from '../src/program';

it('runs a program', async () => {
	const program = new Program();

	const { code, output } = await runProgram(program, ['cmd', '--foo', '123', 'bar']);

	expect(output).toMatchSnapshot();
	expect(code).toBe(0);
});
```
