import execa from 'execa';
import { Arg, Command, INTERNAL_PROGRAM } from '../src';
import { mockProgram, mockStreams, runCommand } from '../src/test';
import { AllDecoratorCommand } from './__fixtures__/AllDecoratorCommand';
import { AllInitializerCommand } from './__fixtures__/AllInitializerCommand';
import { AllPropsCommand } from './__fixtures__/AllPropsCommand';
import { BuildDecoratorCommand } from './__fixtures__/BuildDecoratorCommand';
import { BuildInitializerCommand } from './__fixtures__/BuildInitializerCommand';
import { BuildPropsCommand } from './__fixtures__/BuildPropsCommand';
import {
	Child,
	GrandChild,
	Parent,
	UnknownChild,
	UnknownGrandChild,
} from './__fixtures__/commands';
import { InstallDecoratorCommand } from './__fixtures__/InstallDecoratorCommand';
import { InstallInitializerCommand } from './__fixtures__/InstallInitializerCommand';
import { InstallPropsCommand } from './__fixtures__/InstallPropsCommand';

jest.mock('execa');
jest.mock('term-size');

describe('Command', () => {
	describe('executeCommand()', () => {
		function mockExeca() {
			(execa as unknown as jest.Mock).mockImplementation((command, args) => ({
				command: `${command} ${args.join(' ')}`,
			}));
		}

		beforeEach(() => {
			mockExeca();
		});

		it('runs a local command', async () => {
			const streams = mockStreams();
			const command = new BuildDecoratorCommand();

			command[INTERNAL_PROGRAM] = mockProgram({}, streams);

			const result = await command.executeCommand('yarn', ['-v']);

			expect(execa).toHaveBeenCalledWith('yarn', ['-v'], streams);
			expect(result).toEqual(expect.objectContaining({ command: 'yarn -v' }));
		});
	});

	describe('getArguments()', () => {
		it('returns an args object', async () => {
			const command = new BuildDecoratorCommand();

			await runCommand(command, ['foo'], { dst: './lib' });

			expect(command.getArguments()).toEqual({
				command: ['build'],
				errors: [],
				options: {
					dst: './lib',
					help: false,
					locale: 'en',
					version: false,
				},
				params: ['foo'],
				rest: [],
				unknown: {},
			});
		});
	});

	describe('decorators', () => {
		it('inherits metadata from @Config and sets static properties', () => {
			const command = new BuildDecoratorCommand();
			const meta = command.getMetadata();

			expect(BuildDecoratorCommand.aliases).toEqual(['compile']);
			expect(BuildDecoratorCommand.description).toBe('Build a project');
			expect(BuildDecoratorCommand.path).toBe('build');
			expect(BuildDecoratorCommand.usage).toBe('build -S ./src -D ./lib');

			expect(BuildDecoratorCommand.description).toBe(meta.description);
			expect(BuildDecoratorCommand.path).toBe(meta.path);
			expect(BuildDecoratorCommand.usage).toBe(meta.usage);
			expect(BuildDecoratorCommand.category).toBe(meta.category);

			// Again with different properties
			const command2 = new InstallDecoratorCommand();
			const meta2 = command2.getMetadata();

			expect(InstallDecoratorCommand.description).toBe('Install package(s)');
			expect(InstallDecoratorCommand.path).toBe('install');
			expect(InstallDecoratorCommand.deprecated).toBe(true);
			expect(InstallDecoratorCommand.hidden).toBe(true);

			expect(InstallDecoratorCommand.description).toBe(meta2.description);
			expect(InstallDecoratorCommand.path).toBe(meta2.path);
			expect(InstallDecoratorCommand.deprecated).toBe(meta2.deprecated);
			expect(InstallDecoratorCommand.hidden).toBe(meta2.hidden);
			expect(InstallDecoratorCommand.category).toBe(meta2.category);
		});

		it('inherits global options from parent', () => {
			const command = new BuildDecoratorCommand();
			const { options } = command.getMetadata();

			expect(options).toEqual({
				dst: { short: 'D', default: '', description: 'Destination path', type: 'string' },
				src: { short: 'S', default: './src', description: 'Source path', type: 'string' },
				help: {
					category: 'global',
					default: false,
					description: 'Display help and usage menu',
					short: 'h',
					type: 'boolean',
				},
				locale: {
					category: 'global',
					default: 'en',
					description: 'Display output in the chosen locale',
					type: 'string',
					validate: expect.any(Function),
				},
				version: {
					category: 'global',
					default: false,
					description: 'Display version number',
					short: 'v',
					type: 'boolean',
				},
			});
		});

		it('inherits global categories from parent', () => {
			const command = new InstallDecoratorCommand();
			const { categories } = command.getMetadata();

			expect(categories).toEqual({
				special: 'Special',
			});
		});

		it('sets params with @Arg.Params', () => {
			const command = new InstallDecoratorCommand();
			const { params } = command.getMetadata();

			expect(params).toEqual([
				{ description: 'Package name', label: 'pkg', required: true, type: 'string' },
			]);
		});

		it('supports all options and params types', () => {
			const command = new AllDecoratorCommand();
			const { options, params } = command.getMetadata();

			expect(options).toEqual(
				expect.objectContaining({
					flag: { default: true, description: 'Boolean flag', short: 'F', type: 'boolean' },
					help: {
						category: 'global',
						default: false,
						description: 'Display help and usage menu',
						short: 'h',
						type: 'boolean',
					},
					locale: {
						category: 'global',
						default: 'en',
						description: 'Display output in the chosen locale',
						type: 'string',
						validate: expect.any(Function),
					},
					num: {
						count: true,
						default: 0,
						description: 'Single number',
						short: 'N',
						type: 'number',
					},
					nums: {
						default: [],
						deprecated: true,
						description: 'List of numbers',
						multiple: true,
						type: 'number',
					},
					str: {
						choices: ['a', 'b', 'c'],
						default: 'a',
						description: 'Single string',
						hidden: true,
						type: 'string',
					},
					strs: {
						arity: 5,
						default: [],
						description: 'List of strings',
						multiple: true,
						short: 'S',
						type: 'string',
						validate: expect.any(Function),
					},
					version: {
						category: 'global',
						default: false,
						description: 'Display version number',
						short: 'v',
						type: 'boolean',
					},
				}),
			);

			expect(params).toEqual([
				{ description: 'String', label: 'char', required: true, type: 'string' },
				{ description: 'Boolean', type: 'boolean', default: true },
				{ description: 'Number', label: 'int', type: 'number', default: 123 },
			]);
		});

		it('errors if @Params is not on the run method', () => {
			expect(() => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				class TestCommand extends Command {
					@Arg.Params()
					unknownArg() {}

					run() {
						return Promise.resolve('');
					}
				}
			}).toThrow('Parameters must be defined on the `run()` method.');
		});

		it('errors if option is using a reserved name', () => {
			expect(() => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				class TestCommand extends Command {
					@Arg.String('Description')
					override locale: string = '';

					run() {
						return Promise.resolve('');
					}
				}
			}).toThrow('Option "locale" is a reserved name and cannot be used.');
		});

		it('returns command line path', () => {
			const command = new BuildDecoratorCommand();

			expect(command.getPath()).toBe('build');
		});

		it('returns parser options', () => {
			const command = new BuildDecoratorCommand();

			expect(command.getParserOptions()).toEqual({
				commands: ['build', 'compile'],
				options: {
					dst: { default: '', short: 'D', description: 'Destination path', type: 'string' },
					src: { default: './src', short: 'S', description: 'Source path', type: 'string' },
					help: {
						category: 'global',
						default: false,
						description: 'Display help and usage menu',
						short: 'h',
						type: 'boolean',
					},
					locale: {
						category: 'global',
						default: 'en',
						description: 'Display output in the chosen locale',
						type: 'string',
						validate: expect.any(Function),
					},
					version: {
						category: 'global',
						default: false,
						description: 'Display version number',
						short: 'v',
						type: 'boolean',
					},
				},
				params: [],
				unknown: false,
				variadic: false,
			});
		});
	});

	describe('initializers', () => {
		it('inherits metadata from static properties', () => {
			const command = new BuildInitializerCommand();
			const meta = command.getMetadata();

			expect(BuildInitializerCommand.aliases).toEqual(['compile']);
			expect(BuildInitializerCommand.description).toBe('Build a project');
			expect(BuildInitializerCommand.path).toBe('build');
			expect(BuildInitializerCommand.usage).toBe('build -S ./src -D ./lib');

			expect(BuildInitializerCommand.description).toBe(meta.description);
			expect(BuildInitializerCommand.path).toBe(meta.path);
			expect(BuildInitializerCommand.usage).toBe(meta.usage);
			expect(BuildInitializerCommand.category).toBe(meta.category);

			// Again with different properties
			const command2 = new InstallInitializerCommand();
			const meta2 = command2.getMetadata();

			expect(InstallInitializerCommand.description).toBe('Install package(s)');
			expect(InstallInitializerCommand.path).toBe('install');
			expect(InstallInitializerCommand.deprecated).toBe(true);
			expect(InstallInitializerCommand.hidden).toBe(false);

			expect(InstallInitializerCommand.description).toBe(meta2.description);
			expect(InstallInitializerCommand.path).toBe(meta2.path);
			expect(InstallInitializerCommand.deprecated).toBe(meta2.deprecated);
			expect(InstallInitializerCommand.hidden).toBe(meta2.hidden);
			expect(InstallInitializerCommand.category).toBe(meta2.category);
		});

		it('inherits global options from parent', () => {
			const command = new BuildInitializerCommand();
			const { options } = command.getMetadata();

			expect(options).toEqual({
				dst: { short: 'D', default: '', description: 'Destination path', type: 'string' },
				src: { short: 'S', default: './src', description: 'Source path', type: 'string' },
				help: {
					category: 'global',
					default: false,
					description: 'Display help and usage menu',
					short: 'h',
					type: 'boolean',
				},
				locale: {
					category: 'global',
					default: 'en',
					description: 'Display output in the chosen locale',
					type: 'string',
					validate: expect.any(Function),
				},
				version: {
					category: 'global',
					default: false,
					description: 'Display version number',
					short: 'v',
					type: 'boolean',
				},
			});
		});

		it('inherits global categories from parent', () => {
			const command = new InstallInitializerCommand();
			const { categories } = command.getMetadata();

			expect(categories).toEqual({
				special: 'Special',
			});
		});

		it('sets params with @Arg.Params', () => {
			const command = new InstallInitializerCommand();
			const { params } = command.getMetadata();

			expect(params).toEqual([
				{ description: 'Package name', label: 'pkg', required: true, type: 'string' },
			]);
		});

		it('supports all options and params types', () => {
			const command = new AllInitializerCommand();
			const { options, params } = command.getMetadata();

			expect(options).toEqual(
				expect.objectContaining({
					flag: { default: true, description: 'Boolean flag', short: 'F', type: 'boolean' },
					help: {
						category: 'global',
						default: false,
						description: 'Display help and usage menu',
						short: 'h',
						type: 'boolean',
					},
					locale: {
						category: 'global',
						default: 'en',
						description: 'Display output in the chosen locale',
						type: 'string',
						validate: expect.any(Function),
					},
					num: {
						count: true,
						default: 0,
						description: 'Single number',
						short: 'N',
						type: 'number',
					},
					nums: {
						default: [],
						deprecated: true,
						description: 'List of numbers',
						multiple: true,
						type: 'number',
					},
					str: {
						choices: ['a', 'b', 'c'],
						default: 'a',
						description: 'Single string',
						hidden: true,
						type: 'string',
					},
					strs: {
						arity: 5,
						default: [],
						description: 'List of strings',
						multiple: true,
						short: 'S',
						type: 'string',
						validate: expect.any(Function),
					},
					version: {
						category: 'global',
						default: false,
						description: 'Display version number',
						short: 'v',
						type: 'boolean',
					},
				}),
			);

			expect(params).toEqual([
				{ description: 'String', label: 'char', required: true, type: 'string' },
				{ description: 'Boolean', type: 'boolean', default: true },
				{ description: 'Number', label: 'int', type: 'number', default: 123 },
			]);
		});

		it('errors if option is using a reserved name', () => {
			expect(() => {
				class TestCommand extends Command {
					override locale = Arg.string('Description');

					run() {
						return Promise.resolve('');
					}
				}

				// Initializers have to be triggered
				return new TestCommand().getMetadata();
			}).toThrow('Option "locale" is a reserved name and cannot be used.');
		});

		it('returns command line path', () => {
			const command = new BuildInitializerCommand();

			expect(command.getPath()).toBe('build');
		});

		it('returns parser options', () => {
			const command = new BuildInitializerCommand();

			expect(command.getParserOptions()).toEqual({
				commands: ['build', 'compile'],
				options: {
					dst: { default: '', short: 'D', description: 'Destination path', type: 'string' },
					src: { default: './src', short: 'S', description: 'Source path', type: 'string' },
					help: {
						category: 'global',
						default: false,
						description: 'Display help and usage menu',
						short: 'h',
						type: 'boolean',
					},
					locale: {
						category: 'global',
						default: 'en',
						description: 'Display output in the chosen locale',
						type: 'string',
						validate: expect.any(Function),
					},
					version: {
						category: 'global',
						default: false,
						description: 'Display version number',
						short: 'v',
						type: 'boolean',
					},
				},
				params: [],
				unknown: false,
				variadic: false,
			});
		});
	});

	describe('static properties', () => {
		it('inherits metadata from static properties', () => {
			const command = new BuildPropsCommand();
			const meta = command.getMetadata();

			expect(BuildPropsCommand.aliases).toEqual(['compile']);
			expect(BuildPropsCommand.description).toBe('Build a project');
			expect(BuildPropsCommand.path).toBe('build');
			expect(BuildPropsCommand.usage).toBe('build -S ./src -D ./lib');

			expect(BuildPropsCommand.description).toBe(meta.description);
			expect(BuildPropsCommand.path).toBe(meta.path);
			expect(BuildPropsCommand.usage).toBe(meta.usage);
			expect(BuildPropsCommand.category).toBe(meta.category);

			// Again with different properties
			const command2 = new InstallPropsCommand();
			const meta2 = command2.getMetadata();

			expect(InstallPropsCommand.description).toBe('Install package(s)');
			expect(InstallPropsCommand.path).toBe('install');
			expect(InstallPropsCommand.deprecated).toBe(true);
			expect(InstallPropsCommand.hidden).toBe(true);

			expect(InstallPropsCommand.description).toBe(meta2.description);
			expect(InstallPropsCommand.path).toBe(meta2.path);
			expect(InstallPropsCommand.deprecated).toBe(meta2.deprecated);
			expect(InstallPropsCommand.hidden).toBe(meta2.hidden);
			expect(InstallPropsCommand.category).toBe(meta2.category);
		});

		it('inherits global options from parent', () => {
			const command = new BuildPropsCommand();
			const { options } = command.getMetadata();

			expect(options).toEqual({
				dst: { short: 'D', default: '', description: 'Destination path', type: 'string' },
				src: { short: 'S', default: './src', description: 'Source path', type: 'string' },
				help: {
					category: 'global',
					default: false,
					description: 'Display help and usage menu',
					short: 'h',
					type: 'boolean',
				},
				locale: {
					category: 'global',
					default: 'en',
					description: 'Display output in the chosen locale',
					type: 'string',
					validate: expect.any(Function),
				},
				version: {
					category: 'global',
					default: false,
					description: 'Display version number',
					short: 'v',
					type: 'boolean',
				},
			});
		});

		it('inherits global categories from parent', () => {
			const command = new InstallPropsCommand();
			const { categories } = command.getMetadata();

			expect(categories).toEqual({
				special: 'Special',
			});
		});

		it('sets params', () => {
			const command = new InstallPropsCommand();
			const { params } = command.getMetadata();

			expect(params).toEqual([
				{ description: 'Package name', label: 'pkg', required: true, type: 'string' },
			]);
		});

		it('supports all options and params types', () => {
			const command = new AllPropsCommand();
			const { options, params } = command.getMetadata();

			expect(options).toEqual({
				flag: { short: 'F', default: false, description: 'Boolean flag', type: 'boolean' },
				num: { count: true, default: 0, short: 'N', description: 'Single number', type: 'number' },
				nums: {
					default: [],
					deprecated: true,
					description: 'List of numbers',
					multiple: true,
					type: 'number',
				},
				str: {
					choices: ['a', 'b', 'c'],
					default: 'a',
					hidden: true,
					description: 'Single string',
					type: 'string',
				},
				strs: {
					arity: 5,
					default: [],
					short: 'S',
					validate: expect.any(Function),
					description: 'List of strings',
					multiple: true,
					type: 'string',
				},
				help: {
					category: 'global',
					default: false,
					description: 'Display help and usage menu',
					short: 'h',
					type: 'boolean',
				},
				locale: {
					category: 'global',
					default: 'en',
					description: 'Display output in the chosen locale',
					type: 'string',
					validate: expect.any(Function),
				},
				version: {
					category: 'global',
					default: false,
					description: 'Display version number',
					short: 'v',
					type: 'boolean',
				},
			});

			expect(params).toEqual([
				{ description: 'String', label: 'char', required: true, type: 'string' },
				{ description: 'Boolean', type: 'boolean', default: true },
				{ description: 'Number', label: 'int', type: 'number', default: 123 },
			]);
		});

		it('returns command line path', () => {
			const command = new BuildPropsCommand();

			expect(command.getPath()).toBe('build');
		});

		it('returns parser options', () => {
			const command = new BuildPropsCommand();

			expect(command.getParserOptions()).toEqual({
				commands: ['build', 'compile'],
				options: {
					dst: { default: '', short: 'D', description: 'Destination path', type: 'string' },
					src: { default: './src', short: 'S', description: 'Source path', type: 'string' },
					help: {
						category: 'global',
						default: false,
						description: 'Display help and usage menu',
						short: 'h',
						type: 'boolean',
					},
					locale: {
						category: 'global',
						default: 'en',
						description: 'Display output in the chosen locale',
						type: 'string',
						validate: expect.any(Function),
					},
					version: {
						category: 'global',
						default: false,
						description: 'Display version number',
						short: 'v',
						type: 'boolean',
					},
				},
				params: [],
				unknown: false,
				variadic: false,
			});
		});
	});

	describe('sub-commands', () => {
		it('errors if child is not prefixed with parent', () => {
			const command = new Parent();

			expect(() => {
				command.register(new UnknownChild());
			}).toThrow('Sub-command "unknown" must start with "parent:".');
		});

		it('errors if child is not prefixed with parent (grand depth)', () => {
			const child = new Child();

			expect(() => {
				child.register(new UnknownGrandChild());
			}).toThrow('Sub-command "parent:unknown" must start with "parent:child:".');
		});

		it('errors if the same path is registered', () => {
			const command = new Parent();

			expect(() => {
				command.register(new Child());
				command.register(new Child());
			}).toThrow('A command already exists with the canonical path "parent:child".');
		});

		it('returns null for empty path', () => {
			const parent = new Parent();
			const child = new Child();

			parent.register(child);

			expect(parent.getCommand('')).toBeNull();
		});

		it('returns null for unknown path', () => {
			const parent = new Parent();
			const child = new Child();

			parent.register(child);

			expect(parent.getCommand('unknown')).toBeNull();
		});

		it('supports children', () => {
			const parent = new Parent();
			const child = new Child();

			parent.register(child);

			expect(parent.getMetadata().commands).toEqual({
				'parent:child': child,
			});
		});

		it('supports grand children', () => {
			const parent = new Parent();
			const child = new Child();
			const grandChild = new GrandChild();

			parent.register(child);
			child.register(grandChild);

			expect(parent.getMetadata().commands).toEqual({
				'parent:child': child,
			});

			expect(child.getMetadata().commands).toEqual({
				'parent:child:grandchild': grandChild,
			});
		});
	});
});
