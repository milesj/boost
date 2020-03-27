import AllCommand from './__mocks__/AllCommand';
import AllClassicCommand from './__mocks__/AllClassicCommand';
import BuildCommand from './__mocks__/BuildCommand';
import BuildClassicCommand from './__mocks__/BuildClassicCommand';
import InstallCommand from './__mocks__/InstallCommand';
import InstallClassicCommand from './__mocks__/InstallClassicCommand';
import { Parent, Child, GrandChild, UnknownChild, UnknownGrandChild } from './__mocks__/commands';
import { Command, Arg } from '../src';

describe('Command', () => {
  describe('declarative', () => {
    it('inherits metadata from @Config and sets static properties', () => {
      const command = new BuildCommand();
      const meta = command.getMetadata();

      expect(BuildCommand.description).toBe('Build a project');
      expect(BuildCommand.path).toBe('build');
      expect(BuildCommand.usage).toBe('$ build -S ./src -D ./lib');

      expect(BuildCommand.description).toBe(meta.description);
      expect(BuildCommand.path).toBe(meta.path);
      expect(BuildCommand.usage).toBe(meta.usage);

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
    });

    it('inherits global options from parent', () => {
      const command = new BuildCommand();
      const { options } = command.getMetadata();

      expect(options).toEqual({
        dst: { short: 'D', description: 'Destination path', type: 'string' },
        src: { short: 'S', description: 'Source path', type: 'string' },
        help: { description: 'Display help and usage menu', short: 'h', type: 'boolean' },
        locale: {
          default: 'en',
          description: 'Display output in the chosen locale (e.g. en, en-US)',
          type: 'string',
        },
        version: { description: 'Display version number', short: 'v', type: 'boolean' },
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
          flag: { short: 'F', description: 'Boolean flag', type: 'boolean' },
          num: { count: true, short: 'N', description: 'Single number', type: 'number' },
          nums: {
            deprecated: true,
            default: [],
            description: 'List of numbers',
            multiple: true,
            type: 'number',
          },
          str: {
            choices: ['a', 'b', 'c'],
            hidden: true,
            description: 'Single string',
            type: 'string',
          },
          strs: {
            arity: 5,
            short: 'S',
            validate: expect.any(Function),
            default: [],
            description: 'List of strings',
            multiple: true,
            type: 'string',
          },
          help: { description: 'Display help and usage menu', short: 'h', type: 'boolean' },
          locale: {
            default: 'en',
            description: 'Display output in the chosen locale (e.g. en, en-US)',
            type: 'string',
          },
          version: { description: 'Display version number', short: 'v', type: 'boolean' },
        }),
      );

      expect(params).toEqual([
        { description: 'String', label: 'char', required: true, type: 'string' },
        { description: 'Boolean', type: 'boolean' },
        { description: 'Number', label: 'int', type: 'number' },
      ]);
    });

    it('errors if @Params is not on the run method', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestCommand extends Command {
          @Arg.Params()
          unknown() {}

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
        commands: ['build'],
        options: {
          dst: { default: '', short: 'D', description: 'Destination path', type: 'string' },
          src: { default: './src', short: 'S', description: 'Source path', type: 'string' },
          help: {
            default: false,
            description: 'Display help and usage menu',
            short: 'h',
            type: 'boolean',
          },
          locale: {
            default: 'en',
            description: 'Display output in the chosen locale (e.g. en, en-US)',
            type: 'string',
          },
          version: {
            default: false,
            description: 'Display version number',
            short: 'v',
            type: 'boolean',
          },
        },
        params: [],
        unknown: false,
      });
    });
  });

  describe('imperative', () => {
    it('inherits metadata from static properties', () => {
      const command = new BuildClassicCommand();
      const meta = command.getMetadata();

      expect(BuildCommand.description).toBe('Build a project');
      expect(BuildCommand.path).toBe('build');
      expect(BuildCommand.usage).toBe('$ build -S ./src -D ./lib');

      expect(BuildCommand.description).toBe(meta.description);
      expect(BuildCommand.path).toBe(meta.path);
      expect(BuildCommand.usage).toBe(meta.usage);

      // Again with different properties
      const command2 = new InstallClassicCommand();
      const meta2 = command2.getMetadata();

      expect(InstallCommand.description).toBe('Install package(s)');
      expect(InstallCommand.path).toBe('install');
      expect(InstallCommand.deprecated).toBe(true);
      expect(InstallCommand.hidden).toBe(true);

      expect(InstallCommand.description).toBe(meta2.description);
      expect(InstallCommand.path).toBe(meta2.path);
      expect(InstallCommand.deprecated).toBe(meta2.deprecated);
      expect(InstallCommand.hidden).toBe(meta2.hidden);
    });

    it('inherits global options from parent', () => {
      const command = new BuildClassicCommand();
      const { options } = command.getMetadata();

      expect(options).toEqual({
        dst: { short: 'D', description: 'Destination path', type: 'string' },
        src: { short: 'S', description: 'Source path', type: 'string' },
        help: { description: 'Display help and usage menu', short: 'h', type: 'boolean' },
        locale: {
          default: 'en',
          description: 'Display output in the chosen locale (e.g. en, en-US)',
          type: 'string',
        },
        version: { description: 'Display version number', short: 'v', type: 'boolean' },
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
        flag: { short: 'F', description: 'Boolean flag', type: 'boolean' },
        num: { count: true, short: 'N', description: 'Single number', type: 'number' },
        nums: {
          deprecated: true,
          description: 'List of numbers',
          multiple: true,
          type: 'number',
        },
        str: {
          choices: ['a', 'b', 'c'],
          hidden: true,
          description: 'Single string',
          type: 'string',
        },
        strs: {
          arity: 5,
          short: 'S',
          validate: expect.any(Function),
          description: 'List of strings',
          multiple: true,
          type: 'string',
        },
        help: { description: 'Display help and usage menu', short: 'h', type: 'boolean' },
        locale: {
          default: 'en',
          description: 'Display output in the chosen locale (e.g. en, en-US)',
          type: 'string',
        },
        version: { description: 'Display version number', short: 'v', type: 'boolean' },
      });

      expect(params).toEqual([
        { description: 'String', label: 'char', required: true, type: 'string' },
        { description: 'Boolean', type: 'boolean' },
        { description: 'Number', label: 'int', type: 'number' },
      ]);
    });

    it('returns command line path', () => {
      const command = new BuildClassicCommand();

      expect(command.getPath()).toBe('build');
    });

    it('returns parser options', () => {
      const command = new BuildClassicCommand();

      expect(command.getParserOptions()).toEqual({
        commands: ['build'],
        options: {
          dst: { default: '', short: 'D', description: 'Destination path', type: 'string' },
          src: { default: './src', short: 'S', description: 'Source path', type: 'string' },
          help: {
            default: false,
            description: 'Display help and usage menu',
            short: 'h',
            type: 'boolean',
          },
          locale: {
            default: 'en',
            description: 'Display output in the chosen locale (e.g. en, en-US)',
            type: 'string',
          },
          version: {
            default: false,
            description: 'Display version number',
            short: 'v',
            type: 'boolean',
          },
        },
        params: [],
        unknown: false,
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
