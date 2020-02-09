// import { Command, Config, Arg, GlobalArgumentOptions } from '../src';

import AllCommand from './__mocks__/AllCommand';
import AllClassicCommand from './__mocks__/AllClassicCommand';
import BuildCommand from './__mocks__/BuildCommand';
import BuildClassicCommand from './__mocks__/BuildClassicCommand';
import InstallCommand from './__mocks__/InstallCommand';
import InstallClassicCommand from './__mocks__/InstallClassicCommand';

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
        help: {
          short: 'h',
          description: 'Display help and usage menu',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: false,
          validate: null,
        },
        locale: {
          description: 'Display output in the chosen locale (e.g. en, en-US)',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: 'en',
          validate: null,
          short: '',
          choices: [],
          count: false,
        },
        version: {
          short: 'v',
          description: 'Display version number',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: false,
          validate: null,
        },
        dst: {
          short: 'D',
          description: 'Destination path',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          choices: [],
          count: false,
        },
        src: {
          short: 'S',
          description: 'Source path',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          choices: [],
          count: false,
        },
      });
    });

    it('sets params with @Arg.Params', () => {
      const command = new InstallCommand();
      const { params } = command.getMetadata();

      expect(params).toEqual([
        {
          description: 'Package name',
          label: 'pkg',
          required: true,
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
        },
      ]);
    });

    it('supports all options and params types', () => {
      const command = new AllCommand();
      const { options, params } = command.getMetadata();

      expect(options).toEqual(
        expect.objectContaining({
          flag: {
            short: 'F',
            description: 'Boolean flag',
            type: 'boolean',
            deprecated: false,
            hidden: false,
            default: false,
            validate: null,
          },
          num: {
            count: true,
            short: 'N',
            description: 'Single number',
            type: 'number',
            deprecated: false,
            hidden: false,
            default: 0,
            validate: null,
            choices: [],
          },
          nums: {
            deprecated: true,
            default: [],
            description: 'List of numbers',
            multiple: true,
            type: 'number',
            hidden: false,
            validate: null,
            short: '',
            arity: 0,
          },
          str: {
            choices: ['a', 'b', 'c'],
            hidden: true,
            description: 'Single string',
            type: 'string',
            deprecated: false,
            default: '',
            validate: null,
            short: '',
            count: false,
          },
          strs: {
            arity: 5,
            short: 'S',
            validate: expect.any(Function),
            default: [],
            description: 'List of strings',
            multiple: true,
            type: 'string',
            deprecated: false,
            hidden: false,
          },
        }),
      );

      expect(params).toEqual([
        {
          description: 'String',
          label: 'char',
          required: true,
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
        },
        {
          description: 'Boolean',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          label: '',
          required: false,
        },
        {
          description: 'Number',
          label: 'int',
          type: 'number',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          required: false,
        },
      ]);
    });

    it('maps @Arg.Rest to a property', () => {
      const command = new AllCommand();
      const { rest } = command.getMetadata();

      expect(rest).toBe('remaining');
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
        help: {
          short: 'h',
          description: 'Display help and usage menu',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: false,
          validate: null,
        },
        locale: {
          description: 'Display output in the chosen locale (e.g. en, en-US)',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: 'en',
          validate: null,
          short: '',
          choices: [],
          count: false,
        },
        version: {
          short: 'v',
          description: 'Display version number',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: false,
          validate: null,
        },
        dst: {
          short: 'D',
          description: 'Destination path',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          choices: [],
          count: false,
        },
        src: {
          short: 'S',
          description: 'Source path',
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          choices: [],
          count: false,
        },
      });
    });

    it('sets params', () => {
      const command = new InstallClassicCommand();
      const { params } = command.getMetadata();

      expect(params).toEqual([
        {
          description: 'Package name',
          label: 'pkg',
          required: true,
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
        },
      ]);
    });

    it('supports all options and params types', () => {
      const command = new AllClassicCommand();
      const { options, params } = command.getMetadata();

      expect(options).toEqual(
        expect.objectContaining({
          flag: {
            short: 'F',
            description: 'Boolean flag',
            type: 'boolean',
            deprecated: false,
            hidden: false,
            default: false,
            validate: null,
          },
          num: {
            count: true,
            short: 'N',
            description: 'Single number',
            type: 'number',
            deprecated: false,
            hidden: false,
            default: 0,
            validate: null,
            choices: [],
          },
          nums: {
            deprecated: true,
            default: [],
            description: 'List of numbers',
            multiple: true,
            type: 'number',
            hidden: false,
            validate: null,
            short: '',
            arity: 0,
          },
          str: {
            choices: ['a', 'b', 'c'],
            hidden: true,
            description: 'Single string',
            type: 'string',
            deprecated: false,
            default: 'a',
            validate: null,
            short: '',
            count: false,
          },
          strs: {
            arity: 5,
            short: 'S',
            validate: expect.any(Function),
            default: [],
            description: 'List of strings',
            multiple: true,
            type: 'string',
            deprecated: false,
            hidden: false,
          },
        }),
      );

      expect(params).toEqual([
        {
          description: 'String',
          label: 'char',
          required: true,
          type: 'string',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
        },
        {
          description: 'Boolean',
          type: 'boolean',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          label: '',
          required: false,
        },
        {
          description: 'Number',
          label: 'int',
          type: 'number',
          deprecated: false,
          hidden: false,
          default: '',
          validate: null,
          required: false,
        },
      ]);
    });

    it('maps rest to a property', () => {
      const command = new AllClassicCommand();
      const { rest } = command.getMetadata();

      expect(rest).toBe('remaining');
    });
  });
});
