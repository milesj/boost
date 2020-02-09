// import { Command, Config, Arg, GlobalArgumentOptions } from '../src';
import BuildCommand from './__mocks__/BuildCommand';
import InstallCommand from './__mocks__/InstallCommand';

describe('Command', () => {
  describe('decorators', () => {
    it('inherits metadata from @Config and sets static properties', () => {
      const command = new BuildCommand();
      const meta = command.getMetadata();

      expect(BuildCommand.description).toBe('Build a project');
      expect(BuildCommand.path).toBe('build');
      expect(BuildCommand.usage).toBe('$ build -S ./src -D ./lib');

      expect(BuildCommand.description).toBe(meta.description);
      expect(BuildCommand.path).toBe(meta.path);
      expect(BuildCommand.usage).toBe(meta.usage);
    });

    it('inherits options from @Arg.*', () => {
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

    it('inherits params from @Arg.Params', () => {
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
  });

  describe('classic', () => {});
});
