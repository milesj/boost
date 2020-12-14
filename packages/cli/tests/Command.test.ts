import execa from 'execa';
import AllCommand from './__mocks__/AllCommand';
import AllClassicCommand from './__mocks__/AllClassicCommand';
import BuildCommand from './__mocks__/BuildCommand';
import BuildClassicCommand from './__mocks__/BuildClassicCommand';
import InstallCommand from './__mocks__/InstallCommand';
import InstallClassicCommand from './__mocks__/InstallClassicCommand';
import { Parent, Child, GrandChild, UnknownChild, UnknownGrandChild } from './__mocks__/commands';
import { Command, Arg, INTERNAL_PROGRAM } from '../src';
import { mockStreams, mockProgram, runCommand } from '../src/test';

jest.mock('execa');
jest.mock('term-size');

describe('Command', () => {
  describe('executeCommand()', () => {
    function mockExeca() {
      ((execa as unknown) as jest.Mock).mockImplementation((command, args) => ({
        command: `${command} ${args.join(' ')}`,
      }));
    }

    beforeEach(() => {
      mockExeca();
    });

    it('runs a local command', async () => {
      const streams = mockStreams();
      const command = new BuildCommand();

      command[INTERNAL_PROGRAM] = mockProgram({}, streams);

      const result = await command.executeCommand('yarn', ['-v']);

      expect(execa).toHaveBeenCalledWith('yarn', ['-v'], streams);
      expect(result).toEqual(expect.objectContaining({ command: 'yarn -v' }));
    });
  });

  describe('getArguments()', () => {
    it('returns an args object', async () => {
      const command = new BuildCommand();

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

  describe('declarative', () => {
    it('inherits metadata from @Config and sets static properties', () => {
      const command = new BuildCommand();
      const meta = command.getMetadata();

      expect(BuildCommand.aliases).toEqual(['compile']);
      expect(BuildCommand.description).toBe('Build a project');
      expect(BuildCommand.path).toBe('build');
      expect(BuildCommand.usage).toBe('build -S ./src -D ./lib');

      expect(BuildCommand.description).toBe(meta.description);
      expect(BuildCommand.path).toBe(meta.path);
      expect(BuildCommand.usage).toBe(meta.usage);
      expect(BuildCommand.category).toBe(meta.category);

      // Again with different properties
      const command2 = new InstallCommand();
      const meta2 = command2.getMetadata();

      expect(InstallCommand.description).toBe('Install package(s)');
      expect(InstallCommand.path).toBe('install');
      expect(InstallCommand.deprecated).toBe(true);
      expect(InstallCommand.hidden).toBe(true);

      expect(InstallCommand.description).toBe(meta2.description);
      expect(InstallCommand.path).toBe(meta2.path);
      expect(InstallCommand.deprecated).toBe(meta2.deprecated);
      expect(InstallCommand.hidden).toBe(meta2.hidden);
      expect(InstallCommand.category).toBe(meta2.category);
    });

    it('inherits global options from parent', () => {
      const command = new BuildCommand();
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
      const command = new InstallCommand();
      const { categories } = command.getMetadata();

      expect(categories).toEqual({
        special: 'Special',
      });
    });

    it('sets params with @Arg.Params', () => {
      const command = new InstallCommand();
      const { params } = command.getMetadata();

      expect(params).toEqual([
        { description: 'Package name', label: 'pkg', required: true, type: 'string' },
      ]);
    });

    it('supports all options and params types', () => {
      const command = new AllCommand();
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
          locale: string = '';

          run() {
            return Promise.resolve('');
          }
        }
      }).toThrow('Option "locale" is a reserved name and cannot be used.');
    });

    it('returns command line path', () => {
      const command = new BuildCommand();

      expect(command.getPath()).toBe('build');
    });

    it('returns parser options', () => {
      const command = new BuildCommand();

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

  describe('imperative', () => {
    it('inherits metadata from static properties', () => {
      const command = new BuildClassicCommand();
      const meta = command.getMetadata();

      expect(BuildClassicCommand.aliases).toEqual(['compile']);
      expect(BuildClassicCommand.description).toBe('Build a project');
      expect(BuildClassicCommand.path).toBe('build');
      expect(BuildClassicCommand.usage).toBe('build -S ./src -D ./lib');

      expect(BuildClassicCommand.description).toBe(meta.description);
      expect(BuildClassicCommand.path).toBe(meta.path);
      expect(BuildClassicCommand.usage).toBe(meta.usage);
      expect(BuildClassicCommand.category).toBe(meta.category);

      // Again with different properties
      const command2 = new InstallClassicCommand();
      const meta2 = command2.getMetadata();

      expect(InstallClassicCommand.description).toBe('Install package(s)');
      expect(InstallClassicCommand.path).toBe('install');
      expect(InstallClassicCommand.deprecated).toBe(true);
      expect(InstallClassicCommand.hidden).toBe(true);

      expect(InstallClassicCommand.description).toBe(meta2.description);
      expect(InstallClassicCommand.path).toBe(meta2.path);
      expect(InstallClassicCommand.deprecated).toBe(meta2.deprecated);
      expect(InstallClassicCommand.hidden).toBe(meta2.hidden);
      expect(InstallClassicCommand.category).toBe(meta2.category);
    });

    it('inherits global options from parent', () => {
      const command = new BuildClassicCommand();
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
      const command = new InstallClassicCommand();
      const { categories } = command.getMetadata();

      expect(categories).toEqual({
        special: 'Special',
      });
    });

    it('sets params', () => {
      const command = new InstallClassicCommand();
      const { params } = command.getMetadata();

      expect(params).toEqual([
        { description: 'Package name', label: 'pkg', required: true, type: 'string' },
      ]);
    });

    it('supports all options and params types', () => {
      const command = new AllClassicCommand();
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
      const command = new BuildClassicCommand();

      expect(command.getPath()).toBe('build');
    });

    it('returns parser options', () => {
      const command = new BuildClassicCommand();

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
