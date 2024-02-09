/* eslint-disable compat/compat, promise/prefer-await-to-then */

import React, { useContext, useEffect } from 'react';
import { Box, Text } from 'ink';
import { ExitError } from '@boost/common';
import { env } from '@boost/internal';
import { mockLogger } from '@boost/log/test';
import {
	Arg,
	Command,
	Config,
	GlobalOptions,
	INTERNAL_OPTIONS,
	OptionConfigMap,
	Options,
	Program,
	TaskContext,
	UnknownOptionMap,
} from '../src';
import { ProgramContext, useProgram } from '../src/react';
import { MockReadStream, MockWriteStream, runProgram, runTask } from '../src/test';
import { AllPropsCommand } from './__fixtures__/AllPropsCommand';
import { options, params } from './__fixtures__/args';
import { BuildDecoratorCommand } from './__fixtures__/BuildDecoratorCommand';
import { BuildPropsCommand } from './__fixtures__/BuildPropsCommand';
import { ClientDecoratorCommand } from './__fixtures__/ClientDecoratorCommand';
import { Child, GrandChild, Parent } from './__fixtures__/commands';
import { InstallDecoratorCommand } from './__fixtures__/InstallDecoratorCommand';
import { vi } from 'vitest';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

vi.mock('term-size');

class BoostCommand extends Command {
	static override description = 'Description';

	static override path = 'boost';

	static override allowUnknownOptions = true;

	static override allowVariadicParams = true;

	run() {
		return Promise.resolve();
	}
}

class ErrorCommand extends Command {
	static override description = 'Description';

	static override path = 'boost';

	static override allowVariadicParams = true;

	run(): Promise<void> {
		throw new Error('Broken!');
	}
}

class StringCommand extends Command {
	static override description = 'Description';

	static override path = 'string';

	run() {
		return 'Hello!';
	}
}

class ComponentCommand extends Command {
	static override description = 'Description';

	static override path = 'comp';

	run() {
		return (
			<Box>
				<Text>Hello!</Text>
			</Box>
		);
	}
}

describe('<Program />', () => {
	let program: Program;
	let stderr: MockWriteStream;
	let stdout: MockWriteStream;
	let stdin: MockReadStream;

	function createProgram(append?: boolean) {
		stderr = new MockWriteStream(append);
		stdout = new MockWriteStream(append);
		stdin = new MockReadStream();
		program = new Program(
			{
				bin: 'boost',
				name: 'Boost',
				version: '1.2.3',
			},
			{
				stderr: stderr as unknown as NodeJS.WriteStream,
				stdout: stdout as unknown as NodeJS.WriteStream,
				stdin: stdin as unknown as NodeJS.ReadStream,
			},
		);
	}

	beforeEach(() => {
		createProgram();
	});

	it('errors if bin is not kebab case', () => {
		expect(
			() =>
				new Program({
					bin: 'boostRocketGo_go',
					name: 'Boost',
					version: '1.2.3',
				}),
		).toThrowErrorMatchingSnapshot();
	});

	it('errors for invalid version format', () => {
		expect(
			() =>
				new Program({
					bin: 'boost',
					name: 'Boost',
					version: 'a.b12.323',
				}),
		).toThrowErrorMatchingSnapshot();
	});

	describe('bootstrap', () => {
		it('can pass a boostrap function when running', async () => {
			const order: string[] = [];

			class BootstrapCommand extends Command {
				static override description = 'Description';

				static override path = 'boot';

				run() {
					order.push('second');
				}
			}

			program.register(new BootstrapCommand());

			await program.run(['boot'], async () => {
				await new Promise((resolve) => {
					setTimeout(() => {
						order.push('first');
						resolve(undefined);
					}, 150);
				});
			});

			expect(order).toEqual(['first', 'second']);
		});
	});

	describe('exit', () => {
		it('can exit', () => {
			expect(() => {
				program.exit();
			}).toThrow(new ExitError('', 0));
		});

		it('can exit with a string', () => {
			expect(() => {
				program.exit('Oops');
			}).toThrow(new ExitError('Oops', 1));
		});

		it('can exit with an error', () => {
			expect(() => {
				program.exit(new Error('Oops'));
			}).toThrow(new ExitError('Oops', 1));
		});

		it('can exit with an exit error', () => {
			expect(() => {
				program.exit(new ExitError('Oops', 123));
			}).toThrow(new ExitError('Oops', 123));
		});

		it('can exit with a custom code', () => {
			expect(() => {
				program.exit('Oops', 10);
			}).toThrow(new ExitError('Oops', 10));
		});

		it('emits `onExit` event', () => {
			const spy = vi.fn();

			program.onExit.listen(spy);

			try {
				program.exit('Oops', 10);
			} catch {
				// Ignore
			}

			expect(spy).toHaveBeenCalledWith('Oops', 10);
		});

		function ExitComponent({ error }: { error: boolean }) {
			const { exit } = useProgram();

			useEffect(() => {
				if (error) {
					exit('Fail!');
				} else {
					exit();
				}
			}, [error, exit]);

			return (
				<Box>
					<Text>Content</Text>
				</Box>
			);
		}

		class ExitCommand extends Command {
			static override description = 'Description';

			static override path = 'boost';

			static override options = {
				component: {
					description: 'Render component',
					type: 'boolean',
				},
				error: {
					description: 'Error',
					type: 'boolean',
				},
			} as const;

			component = false;

			error = false;

			run() {
				this.log('Before');

				if (this.component) {
					return <ExitComponent error={this.error} />;
				}

				if (this.error) {
					this.exit('Fail!');
				} else {
					this.exit();
				}

				return 'After';
			}
		}

		it('renders a zero exit', async () => {
			program.default(new ExitCommand());

			const { code, output } = await runProgram(program, []);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('renders a zero exit with a component', async () => {
			program.default(new ExitCommand());

			const { code, output } = await runProgram(program, ['--component']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('renders a non-zero exit', async () => {
			program.default(new ExitCommand());

			const { code, output } = await runProgram(program, ['--error']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders a non-zero exit with component', async () => {
			program.default(new ExitCommand());

			const { code, output } = await runProgram(program, ['--error', '--component']);

			expect(output).toMatchSnapshot();

			// This should be 1 but waitUntilExit() doesnt get called in tests
			// which is what would set the code via an ExitError.
			expect(code).toBe(0);
		});
	});

	describe('error', () => {
		function ErrorComponent() {
			throw new Error('Fail from component');
		}

		class Error2Command extends Command {
			static override description = 'Description';

			static override path = 'boost';

			static override options = {
				component: {
					description: 'Render component',
					type: 'boolean',
				},
			} as const;

			component = false;

			run() {
				this.log('Before');

				if (this.component) {
					// @ts-expect-error JSX error
					return <ErrorComponent />;
				}

				throw new Error('Fail');
			}
		}

		it('renders a thrown error', async () => {
			program.default(new Error2Command());

			const { code, output } = await runProgram(program, []);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});
	});

	describe('commands', () => {
		it('registers and returns a command with path', () => {
			const command = new BuildDecoratorCommand();

			program.register(command);

			expect(program.getCommand('build')).toBe(command);
		});

		it('returns an aliased command', () => {
			const command = new BuildDecoratorCommand();

			program.register(command);

			expect(program.getCommand('compile')).toBe(command);
		});

		it('errors if command with same path is registered', () => {
			const command = new BuildDecoratorCommand();

			expect(() => {
				program.register(command);
				program.register(command);
			}).toThrow('A command already exists with the canonical path "build".');
		});

		it('errors for invalid type', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				program.register(123);
			}).toThrow('Invalid command type being registered.');
		});

		it('returns null if command does not exist', () => {
			expect(program.getCommand('unknown')).toBeNull();
		});

		it('returns null if nested command does not exist', () => {
			const parent = new Parent();
			const child = new Child();

			parent.register(child);
			program.register(parent);

			expect(program.getCommand('parent:child:grandchild')).toBeNull();
		});

		it('returns nested commands by drilling down paths', () => {
			const parent = new Parent();
			const child = new Child();
			const grand = new GrandChild();

			child.register(grand);
			parent.register(child);
			program.register(parent);

			expect(program.getCommand('parent:child:grandchild')).toBe(grand);
		});

		it('returns nested alias commands', () => {
			const command = new ClientDecoratorCommand();

			program.register(command);

			expect(program.getCommand('client:compile')).not.toBeNull();
		});

		it('registers a default command', () => {
			const command = new BuildDecoratorCommand();

			program.default(command);

			// @ts-expect-error Allow access
			expect(program.standAlone).toBe('build');
		});

		it('errors if adding a command and a default is registered', () => {
			expect(() => {
				program.default(new Parent());
				program.register(new Child());
			}).toThrow(
				'A default command has been registered. Cannot mix default and non-default commands.',
			);
		});

		it('errors if adding a default and commands have been registered', () => {
			expect(() => {
				program.register(new Child());
				program.default(new Parent());
			}).toThrow(
				'Other commands have been registered. Cannot mix default and non-default commands.',
			);
		});

		it('returns all command paths', () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			expect(program.getCommandPaths()).toEqual(['build', 'install', 'compile']);
		});

		it('returns all command paths, including nested', () => {
			program.register(new ClientDecoratorCommand());

			expect(program.getCommandPaths()).toEqual([
				'client',
				'client:build',
				'client:install',
				'client:uninstall',
				'client:compile',
				'client:up',
				'client:down',
			]);
		});

		it('emits `onBeforeRegister` and `onAfterRegister` events', () => {
			const cmd = new ClientDecoratorCommand();
			const beforeSpy = vi.fn();
			const afterSpy = vi.fn();

			program.onBeforeRegister.listen(beforeSpy);
			program.onAfterRegister.listen(afterSpy);
			program.register(cmd);

			expect(beforeSpy).toHaveBeenCalledWith('client', cmd);
			expect(afterSpy).toHaveBeenCalledWith('client', cmd);
		});

		it('emits `onBeforeRegister` and `onAfterRegister` events for default command', () => {
			const cmd = new ClientDecoratorCommand();
			const beforeSpy = vi.fn();
			const afterSpy = vi.fn();

			program.onBeforeRegister.listen(beforeSpy);
			program.onAfterRegister.listen(afterSpy);
			program.default(cmd);

			expect(beforeSpy).toHaveBeenCalledWith('client', cmd);
			expect(afterSpy).toHaveBeenCalledWith('client', cmd);
		});
	});

	describe('version', () => {
		it('outputs version when `--version` is passed', async () => {
			program.default(new BoostCommand());

			const { code, output } = await runProgram(program, ['--version']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('outputs version when `-v` is passed', async () => {
			program.default(new BoostCommand());

			const { code, output } = await runProgram(program, ['-v']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});
	});

	describe('locale', () => {
		it('errors for invalid `--locale`', async () => {
			program.default(new BuildDecoratorCommand());

			const { code, output } = await runProgram(program, ['--locale', 'wtf']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});
	});

	describe('help', () => {
		class HelpCommand extends Command {
			static override description = 'Description';

			static override path = 'boost';

			static override options = { ...options };

			static override params = [...params];

			run() {
				return Promise.resolve();
			}
		}

		it('outputs help when `--help` is passed', async () => {
			program.default(new HelpCommand());

			const { code, output } = await runProgram(program, ['--help']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('outputs help when `-h` is passed', async () => {
			program.default(new HelpCommand());

			const { code, output } = await runProgram(program, ['-h']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('outputs help for a specific command', async () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			const { output: o1 } = await runProgram(program, ['build', '-h']);

			expect(o1).toMatchSnapshot();

			const { output: o2 } = await runProgram(program, ['install', '--help']);

			expect(o2).toMatchSnapshot();
		});

		it('outputs help for a nested sub-command', async () => {
			program.register(new ClientDecoratorCommand());

			const { output: o1 } = await runProgram(program, ['client:build', '-h']);

			expect(o1).toMatchSnapshot();

			const { output: o2 } = await runProgram(program, ['client:install', '--help']);

			expect(o2).toMatchSnapshot();

			const { output: o3 } = await runProgram(program, ['client', '--help']);

			expect(o3).toMatchSnapshot();
		});

		it('outputs help for an aliased command', async () => {
			program.register(new BuildDecoratorCommand());

			const { output: o1 } = await runProgram(program, ['build', '-h']);

			expect(o1).toMatchSnapshot();

			const { output: o2 } = await runProgram(program, ['compile', '--help']);

			expect(o2).toMatchSnapshot();
		});

		it('emits `onHelp` event', async () => {
			const spy = vi.fn();

			program.onHelp.listen(spy);
			program.register(new HelpCommand());

			await runProgram(program, ['boost', '--help']);

			expect(spy).toHaveBeenCalled();
		});

		it('emits `onHelp` event for default', async () => {
			const spy = vi.fn();

			program.onHelp.listen(spy);
			program.default(new HelpCommand());

			await runProgram(program, ['--help']);

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('default command', () => {
		it('executes default when no args passed', async () => {
			program.default(new BuildDecoratorCommand());

			const { code, output } = await runProgram(program, []);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});

		it('renders commands when no args passed', async () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			const { code, output } = await runProgram(program, []);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});
	});

	describe('failure', () => {
		it('renders when no commands have been registered', async () => {
			const { code, output } = await runProgram(program, ['build']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders when invalid command name passed', async () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			const { code, output } = await runProgram(program, ['prune']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders when misspelt command name passed', async () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			const { code, output } = await runProgram(program, ['buld']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders when no commands could be found', async () => {
			program.register(new BuildDecoratorCommand());
			program.register(new InstallDecoratorCommand());

			const { code, output } = await runProgram(program, ['--locale=en']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders when args parsing fails', async () => {
			program.default(new ComponentCommand());

			const { code, output } = await runProgram(program, ['--foo']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders if an error is thrown', async () => {
			program.register(new ErrorCommand());

			const { code, output } = await runProgram(program, ['boost']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(1);
		});

		it('renders with custom exit error', async () => {
			class ExitCommand extends Command {
				static override description = 'Description';

				static override path = 'boost';

				run() {
					this.exit('Oops', 123);

					return Promise.resolve();
				}
			}

			program.register(new ExitCommand());

			const { code, output } = await runProgram(program, ['boost']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(123);
		});

		it('emits `onBeforeRun` and `onAfterRun` events', async () => {
			const beforeSpy = vi.fn();
			const afterSpy = vi.fn();

			program.onBeforeRun.listen(beforeSpy);
			program.onAfterRun.listen(afterSpy);

			program.register(new ErrorCommand());

			await runProgram(program, ['boost']);

			expect(beforeSpy).toHaveBeenCalledWith(['boost']);
			expect(afterSpy).toHaveBeenCalledWith(new Error('Broken!'));
		});

		it('emits `onCommandNotFound` event', async () => {
			const spy = vi.fn();

			program.onCommandNotFound.listen(spy);
			program.register(new BuildDecoratorCommand());

			await runProgram(program, ['install', 'foo', 'bar']);

			expect(spy).toHaveBeenCalledWith(['install', 'foo', 'bar'], 'install');
		});
	});

	describe('success', () => {
		beforeEach(() => {
			env('CLI_TEST_FAIL_HARD', 'true');
		});

		afterEach(() => {
			env('CLI_TEST_FAIL_HARD', null);
		});

		it('sets rest args to the rest command property', async () => {
			const command = new BuildDecoratorCommand();

			program.register(command);

			await runProgram(program, ['build', '-S', './src', '--', 'foo', 'bar', '--baz', '-f']);

			expect(command.rest).toEqual(['foo', 'bar', '--baz', '-f']);
		});

		it('sets options as command properties (declarative)', async () => {
			const command = new BuildDecoratorCommand();

			program.register(command);

			await runProgram(program, ['build', '-S', './source', '-D', './library']);

			expect(command.dst).toBe('./library');
			expect(command.help).toBe(false);
			expect(command.locale).toBe('en');
			expect(command.src).toBe('./source');
			expect(command.version).toBe(false);
		});

		it('sets options as command properties (imperative)', async () => {
			const command = new BuildPropsCommand();

			program.register(command);

			await runProgram(program, ['build', '-S', './source']);

			expect(command.dst).toBe('');
			expect(command.help).toBe(false);
			expect(command.locale).toBe('en');
			expect(command.src).toBe('./source');
			expect(command.version).toBe(false);
		});

		it('passes params to run method', async () => {
			const command = new AllPropsCommand();
			const spy = vi.spyOn(command, 'run');

			program.default(command);

			await runProgram(program, ['-F', 'foo', 'true', '123']);

			expect(spy).toHaveBeenCalledWith('foo', true, 123);
		});

		it('can return nothing', async () => {
			class NoneCommand extends Command {
				static override description = 'Description';

				static override path = 'none';

				run() {}
			}

			program.register(new NoneCommand());

			const { output } = await runProgram(program, ['none']);

			expect(output).toBe('');
		});

		it('can return a string that writes directly to stream', async () => {
			program.register(new StringCommand());

			const { output } = await runProgram(program, ['string']);

			expect(output).toBe('Hello!\n');
		});

		it('can return an element that writes with ink', async () => {
			program.register(new ComponentCommand());

			const { output } = await runProgram(program, ['comp']);

			expect(output).toMatchSnapshot();
		});

		it('can run command using aliased path', async () => {
			const command = new BuildDecoratorCommand();
			const spy = vi.fn();

			program.onCommandFound.listen(spy);
			program.register(command);

			const { code } = await runProgram(program, ['compile', '-S', './src']);

			expect(code).toBe(0);
			expect(spy).toHaveBeenCalledWith(['compile', '-S', './src'], 'compile', command);
		});

		it('emits `onBeforeRun` and `onAfterRun` events', async () => {
			const beforeSpy = vi.fn();
			const afterSpy = vi.fn();

			program.onBeforeRun.listen(beforeSpy);
			program.onAfterRun.listen(afterSpy);
			program.register(new BoostCommand());

			await runProgram(program, ['boost', 'foo', 'bar']);

			expect(beforeSpy).toHaveBeenCalledWith(['boost', 'foo', 'bar']);
			expect(afterSpy).toHaveBeenCalled();
		});

		it('emits `onCommandFound` event', async () => {
			const spy = vi.fn();
			const cmd = new BoostCommand();

			program.onCommandFound.listen(spy);
			program.register(cmd);

			await runProgram(program, ['boost', 'foo', 'bar']);

			expect(spy).toHaveBeenCalledWith(['boost', 'foo', 'bar'], 'boost', cmd);
		});

		it('emits `onBeforeRender` and `onAfterRender` events for components', async () => {
			const beforeSpy = vi.fn();
			const afterSpy = vi.fn();

			program.onBeforeRender.listen(beforeSpy);
			program.onAfterRender.listen(afterSpy);
			program.default(new ComponentCommand());

			await runProgram(program, []);

			expect(beforeSpy).toHaveBeenCalledWith(
				<Box>
					<Text>Hello!</Text>
				</Box>,
			);
			expect(afterSpy).toHaveBeenCalled();
		});
	});

	describe('option defaults', () => {
		class DeclCommand extends Command {
			static override description = 'Description';

			static override path = 'cmd';

			@Arg.Number('Number')
			numNoDefault: number = 0;

			@Arg.Number('Number (default)')
			numWithDefault: number = 123;

			@Arg.Flag('Flag (false)')
			flagFalse: boolean = false;

			@Arg.Flag('Flag (true)')
			flagTrue: boolean = true;

			@Arg.String('String')
			strNoDefault: string = '';

			@Arg.String('String (default)')
			strWithDefault: string = 'foo';

			@Arg.Numbers('Numbers')
			numsNoDefault: number[] = [];

			@Arg.Numbers('Numbers (default)')
			numsWithDefault: number[] = [1, 2, 3];

			@Arg.Strings('Strings')
			strsNoDefault: string[] = [];

			@Arg.Strings('Strings (default)')
			strsWithDefault: string[] = ['a', 'b', 'c'];

			run() {}
		}

		class ImpCommand extends Command {
			static override description = 'Description';

			static override path = 'cmd';

			static override options: OptionConfigMap = {
				numNoDefault: {
					description: 'Number',
					type: 'number',
				},
				numWithDefault: {
					default: 123,
					description: 'Number (default)',
					type: 'number',
				},
				flagFalse: {
					description: 'Flag (false)',
					type: 'boolean',
				},
				flagTrue: {
					// Use property
					// default: true,
					description: 'Flag (true)',
					type: 'boolean',
				},
				strNoDefault: {
					description: 'String',
					type: 'string',
				},
				strWithDefault: {
					// Also with property
					default: 'bar',
					description: 'String (default)',
					type: 'string',
				},
				numsNoDefault: {
					description: 'Numbers',
					multiple: true,
					type: 'number',
				},
				numsWithDefault: {
					default: [1, 2, 3],
					description: 'Numbers (default)',
					multiple: true,
					type: 'number',
				},
				strsNoDefault: {
					description: 'Strings',
					multiple: true,
					type: 'string',
				},
				strsWithDefault: {
					description: 'Strings (default)',
					multiple: true,
					type: 'string',
				},
			};

			numNoDefault!: number;

			numWithDefault!: number;

			flagFalse: boolean = false;

			flagTrue: boolean = true;

			strNoDefault: string = '';

			strWithDefault: string = 'foo';

			numsNoDefault: number[] = [];

			numsWithDefault!: number[]; // Use config default

			strsNoDefault!: string[]; // None set in either place

			strsWithDefault: string[] = ['a', 'b', 'c'];

			run() {}
		}

		const runners = {
			declarative: () => new DeclCommand(),
			imperative: () => new ImpCommand(),
		};

		Object.entries(runners).forEach(([type, factory]) => {
			describe(`${type}`, () => {
				let command: ImpCommand;

				beforeEach(() => {
					command = factory();

					env('CLI_TEST_FAIL_HARD', 'true');
				});

				afterEach(() => {
					env('CLI_TEST_FAIL_HARD', null);
				});

				it('returns number option if defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd', '--numNoDefault', '456', '--numWithDefault=789']);

					expect(command.numNoDefault).toBe(456);
					expect(command.numWithDefault).toBe(789);
				});

				it('returns default number option if not defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd']);

					expect(command.numNoDefault).toBe(0);
					expect(command.numWithDefault).toBe(123);
				});

				it('returns boolean option if defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd', '--flagFalse', '--no-flagTrue']);

					expect(command.flagFalse).toBe(true);
					expect(command.flagTrue).toBe(false);
				});

				it('returns default boolean option if not defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd']);

					expect(command.flagFalse).toBe(false);
					expect(command.flagTrue).toBe(true);
				});

				it('returns string option if defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd', '--strNoDefault', 'bar', '--strWithDefault=baz']);

					expect(command.strNoDefault).toBe('bar');
					expect(command.strWithDefault).toBe('baz');
				});

				it('returns default string option if not defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd']);

					expect(command.strNoDefault).toBe('');
					expect(command.strWithDefault).toBe('foo');
				});

				it('returns numbers option if defined', async () => {
					program.register(command);

					await runProgram(program, [
						'cmd',
						'--numsNoDefault',
						'4',
						'5',
						'6',
						'--numsWithDefault',
						'7',
						'8',
						'9',
					]);

					expect(command.numsNoDefault).toEqual([4, 5, 6]);
					expect(command.numsWithDefault).toEqual([7, 8, 9]);
				});

				it('returns default numbers option if not defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd']);

					expect(command.numsNoDefault).toEqual([]);
					expect(command.numsWithDefault).toEqual([1, 2, 3]);
				});

				it('returns strings option if defined', async () => {
					program.register(command);

					await runProgram(program, [
						'cmd',
						'--strsNoDefault',
						'4',
						'5',
						'6',
						'--strsWithDefault',
						'foo',
						'bar',
					]);

					expect(command.strsNoDefault).toEqual(['4', '5', '6']);
					expect(command.strsWithDefault).toEqual(['foo', 'bar']);
				});

				it('returns strings numbers option if not defined', async () => {
					program.register(command);

					await runProgram(program, ['cmd']);

					expect(command.strsNoDefault).toEqual([]);
					expect(command.strsWithDefault).toEqual(['a', 'b', 'c']);
				});
			});
		});
	});

	describe('logging', () => {
		function Log() {
			const { log } = useContext(ProgramContext);

			log('Component log');
			log.error('Component error');

			return (
				<Box>
					<Text>Returned from component!</Text>
				</Box>
			);
		}

		class LogCommand extends Command {
			static override description = 'Description';

			static override path = 'log';

			static override options: OptionConfigMap = {
				component: {
					description: 'With component',
					type: 'boolean',
				},
			};

			component = false;

			run() {
				this.log('Log');
				this.log.debug('Debug');
				this.log.warn('Warn');
				this.log.error('Error');
				this.log.trace('Trace');
				this.log.info('Info');

				if (this.component) {
					return <Log />;
				}

				return 'Returned from command!';
			}
		}

		beforeEach(() => {
			stdout.append = true;
			stderr.append = true;
		});

		it('handles logging when rendering a component', async () => {
			const logSpy = vi.spyOn(stdout, 'write');
			const errSpy = vi.spyOn(stderr, 'write');

			program.register(new LogCommand());

			const { code, output } = await runProgram(program, ['log', '--component']);

			expect(logSpy).toHaveBeenCalled();
			expect(errSpy).toHaveBeenCalled();
			expect(output).toMatchSnapshot();
			expect(code).toBe(0);

			logSpy.mockRestore();
			errSpy.mockRestore();
		});

		it('handles logging when returning a string', async () => {
			const logSpy = vi.spyOn(stdout, 'write');
			const errSpy = vi.spyOn(stderr, 'write');

			program.register(new LogCommand());

			const { code, output } = await runProgram(program, ['log']);

			expect(logSpy).toHaveBeenCalled();
			expect(errSpy).toHaveBeenCalled();
			expect(output).toMatchSnapshot();
			expect(code).toBe(0);

			logSpy.mockRestore();
			errSpy.mockRestore();
		});
	});

	describe('middleware', () => {
		it('errors if not a function', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				program.middleware(123);
			}).toThrow('Middleware must be a function.');
		});

		it('removes node and binary from `process.argv`', async () => {
			const command = new BuildDecoratorCommand();

			program.register(command);

			const { code } = await runProgram(program, [
				'/nvm/12.16.1/bin/node',
				'/boost/bin.js',
				'build',
				'-S',
				'./src',
			]);

			expect(code).toBe(0);
		});

		it('can modify argv before parsing', async () => {
			const command = new BoostCommand();

			program.default(command);
			program.middleware((argv, next) => {
				argv.push('--', 'foo', 'bar');

				return next(argv);
			});

			await runProgram(program, ['--opt', 'value']);

			expect(command.unknown).toEqual({ opt: 'value' });
			expect(command.rest).toEqual(['foo', 'bar']);
		});

		it('can modify argv before parsing using promises', async () => {
			const command = new BoostCommand();

			program.default(command);
			program.middleware((argv, next) =>
				Promise.resolve()
					.then(() => [...argv, '--opt', 'new value'])
					.then(next),
			);

			await runProgram(program, ['--opt', 'value']);

			expect(command.unknown).toEqual({ opt: 'new value' });
		});

		it('can modify args after parsing', async () => {
			const command = new BoostCommand();

			program.default(command);
			program.middleware(async (argv, next) => {
				const args = await next(argv);

				args.options.locale = 'fr';
				args.unknown.key = 'value';

				return args;
			});

			await runProgram(program, ['--opt', 'value']);

			expect(command.unknown).toEqual({ opt: 'value', key: 'value' });
			expect(command[INTERNAL_OPTIONS]).toEqual({
				help: false,
				locale: 'fr',
				version: false,
			});
		});
	});

	describe('categories', () => {
		it('applies categories to index help', async () => {
			@Config('foo', 'Description', { category: 'bottom' })
			class FooCommand extends Command {
				run() {}
			}

			@Config('bar', 'Description', { category: 'top' })
			class BarCommand extends Command {
				run() {}
			}

			@Config('baz', 'Description', { category: 'global' })
			class BazCommand extends Command {
				run() {}
			}

			@Config('qux', 'Description')
			class QuxCommand extends Command {
				run() {}
			}

			program.categories({
				top: { name: 'Top', weight: 50 },
				bottom: 'Bottom',
			});

			program.register(new FooCommand());
			program.register(new BarCommand());
			program.register(new BazCommand());
			program.register(new QuxCommand());

			const { output } = await runProgram(program, ['--help']);

			expect(output).toMatchSnapshot();
		});
	});

	describe('nested programs', () => {
		class NestedProgramCommand extends Command {
			static override description = 'Description';

			static override path = 'prog';

			async run() {
				this.log('Before run');

				await this.runProgram(['client:install', 'foo', '--save']);

				this.log('After run');

				return 'Return';
			}
		}

		class NestedErrorCommand extends Command {
			static override description = 'Description';

			static override path = 'prog-error';

			async run() {
				await this.runProgram(['prog-error-inner']);
			}
		}

		class NestedErrorInnerCommand extends Command {
			static override description = 'Description';

			static override path = 'prog-error-inner';

			run() {
				throw new Error('Bubbles');
			}
		}

		it('can run a program within a command', async () => {
			stdout.append = true;

			program.register(new NestedProgramCommand()).register(new ClientDecoratorCommand());

			const { output } = await runProgram(program, ['prog']);

			expect(output).toMatchSnapshot();
		});

		it('errors if no program instance', () => {
			const command = new NestedProgramCommand();

			expect(() => command.runProgram(['foo'])).toThrow(
				'No program found. Must be ran within the context of a parent program.',
			);
		});

		it('bubbles up errors', async () => {
			program.register(new NestedErrorCommand()).register(new NestedErrorInnerCommand());

			const { output } = await runProgram(program, ['prog-error']);

			expect(output).toMatchSnapshot();
		});
	});

	describe('tasks', () => {
		// Test logging and options
		function syncTask(this: TaskContext, a: number, b: number) {
			this.log('Hi');
			this.log.error('Bye');

			return a + b;
		}

		function nestedSyncTask(this: TaskContext, msg: string) {
			this.log(msg);
			this.log(String(this.runTask(syncTask, 1, 1)));
		}

		// Test misc args
		interface AsyncOptions extends GlobalOptions {
			value: string;
		}

		async function asyncTask(this: TaskContext<AsyncOptions>, a: string, b: string) {
			this.unknown.foo = 'true';

			const c = await Promise.resolve(this.value);

			this.rest.push('foo');

			return c + a + b.toUpperCase();
		}

		beforeEach(() => {
			stdout.append = true;
		});

		it('runs a sync task correctly', async () => {
			class SyncTaskCommand extends Command {
				static override description = 'Description';

				static override path = 'task';

				run() {
					return String(this.runTask(syncTask, 10, 5));
				}
			}

			program.register(new SyncTaskCommand());

			const { output } = await runProgram(program, ['task']);

			expect(output).toMatchSnapshot();
		});

		it('runs a sync task correctly (using test util)', async () => {
			const log = await mockLogger();
			const output = await runTask(syncTask, [10, 5], { log });

			expect(output).toBe(15);
			expect(log).toHaveBeenCalledWith('Hi');
			expect(log.error).toHaveBeenCalledWith('Bye');
		});

		it('runs an async task correctly', async () => {
			class AsyncTaskCommand extends Command<AsyncOptions> {
				static override description = 'Description';

				static override path = 'task';

				static override options: Options<AsyncOptions> = {
					value: {
						description: 'Description',
						type: 'string',
					},
				};

				async run() {
					const value = await this.runTask(asyncTask, 'foo', 'bar');

					return value;
				}
			}

			const command = new AsyncTaskCommand();

			program.register(command);

			const { output } = await runProgram(program, ['task', '--value', 'baz']);

			expect(output).toMatchSnapshot();
			expect(command.unknown.foo).toBe('true');
			expect(command.rest).toEqual(['foo']);
		});

		it('runs an async task correctly (using test util)', async () => {
			const unknown: UnknownOptionMap = {};
			const rest: string[] = [];
			const output = await runTask(asyncTask, ['foo', 'bar'], { unknown, rest, value: 'baz' });

			expect(output).toBe('bazfooBAR');
			expect(unknown.foo).toBe('true');
			expect(rest).toEqual(['foo']);
		});

		it('can run a task within a task', async () => {
			class NestedSyncTaskCommand extends Command {
				static override description = 'Description';

				static override path = 'task';

				run() {
					this.runTask(nestedSyncTask, 'Test');
				}
			}

			program.register(new NestedSyncTaskCommand());

			const { output } = await runProgram(program, ['task']);

			expect(output).toMatchSnapshot();
		});
	});

	describe('components', () => {
		function Comp({ children }: { children: string }) {
			return (
				<Box>
					<Text>{children}</Text>
				</Box>
			);
		}

		class CompCommand extends Command {
			static override description = 'Description';

			static override path = 'comp';

			static override options = {};

			static override params = [];

			async run() {
				this.log('Before');

				await this.render(<Comp>Foo</Comp>);

				this.log.info('Middle');

				await this.render(<Comp>Bar</Comp>);

				this.log.error('After');

				return <Comp>Baz</Comp>;
			}
		}

		beforeEach(() => {
			createProgram(true);
		});

		it('renders and outputs multiple component renders', async () => {
			program.default(new CompCommand());

			const { code, output } = await runProgram(program, ['comp']);

			expect(output).toMatchSnapshot();
			expect(code).toBe(0);
		});
	});
});
