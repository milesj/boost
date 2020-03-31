import React, { useContext } from 'react';
import { Box } from 'ink';
import { ExitError } from '@boost/internal';
import { Program, Command, Arg, OptionConfigMap, ProgramContext, ProgramContextType } from '../src';
import { WriteStream, ReadStream } from './helpers';
import { options, params } from './__mocks__/args';
import { Parent, Child, GrandChild } from './__mocks__/commands';
import BuildCommand from './__mocks__/BuildCommand';
import InstallCommand from './__mocks__/InstallCommand';
import ClientCommand from './__mocks__/ClientCommand';
import AllClassicCommand from './__mocks__/AllClassicCommand';
import BuildClassicCommand from './__mocks__/BuildClassicCommand';

jest.mock('term-size');

// waitUntilExit() never resolves, so we need to mock the entire module ;/
jest.mock('ink', () => {
  const { render, Box: Boxer, Color, Static } = require.requireActual('ink');

  return {
    Box: Boxer,
    Color,
    Static,
    render(element: any, opts: any) {
      return {
        waitUntilExit() {
          try {
            render(element, opts);
          } catch (error) {
            return Promise.reject(error);
          }

          return Promise.resolve();
        },
      };
    },
  };
});

class BoostCommand extends Command {
  static description = 'Description';

  static path = 'boost';

  run() {
    return Promise.resolve();
  }
}

class ErrorCommand extends Command {
  static description = 'Description';

  static path = 'boost';

  run(): Promise<void> {
    throw new Error('Broken!');
  }
}

class StringCommand extends Command {
  static description = 'Description';

  static path = 'string';

  run() {
    return 'Hello!';
  }
}

class ComponentCommand extends Command {
  static description = 'Description';

  static path = 'comp';

  run() {
    return <Box>Hello!</Box>;
  }
}

describe('<Program />', () => {
  let program: Program;
  let stderr: WriteStream;
  let stdout: WriteStream;
  let stdin: ReadStream;

  beforeEach(() => {
    stderr = new WriteStream();
    stdout = new WriteStream();
    stdin = new ReadStream();
    program = new Program(
      {
        bin: 'boost',
        name: 'Boost',
        version: '1.2.3',
      },
      {
        stderr: (stderr as unknown) as NodeJS.WriteStream,
        stdout: (stdout as unknown) as NodeJS.WriteStream,
        stdin: (stdin as unknown) as NodeJS.ReadStream,
      },
    );
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

  describe('exit', () => {
    it('can exit', () => {
      expect(() => {
        program.exit('Oops');
      }).toThrow(new ExitError('Oops', 1));
    });

    it('can exit with a custom code', () => {
      expect(() => {
        program.exit('Oops', 10);
      }).toThrow(new ExitError('Oops', 10));
    });

    it('emits `onExit` event', () => {
      const spy = jest.fn();

      program.onExit.listen(spy);

      try {
        program.exit('Oops', 10);
      } catch {
        // Ignore
      }

      expect(spy).toHaveBeenCalledWith('Oops', 10);
    });
  });

  describe('commands', () => {
    it('registers a command with path', () => {
      const command = new BuildCommand();

      program.register(command);

      expect(program.getCommand('build')).toBe(command);
    });

    it('errors if command with same path is registered', () => {
      const command = new BuildCommand();

      expect(() => {
        program.register(command);
        program.register(command);
      }).toThrow('A command already exists with the canonical path "build".');
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

    it('registers an index command', () => {
      const command = new BuildCommand();

      program.index(command);

      // @ts-ignore Allow access
      expect(program.indexCommand).toBe('build');
    });

    it('errors if adding a command and an index is registered', () => {
      expect(() => {
        program.index(new Parent());
        program.register(new Child());
      }).toThrow('An index command has been registered. Cannot mix index and non-index commands.');
    });

    it('errors if adding an index and commands have been registered', () => {
      expect(() => {
        program.register(new Child());
        program.index(new Parent());
      }).toThrow('Other commands have been registered. Cannot mix index and non-index commands.');
    });

    it('returns all command paths', () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      expect(program.getCommandPaths()).toEqual(['build', 'install']);
    });

    it('returns all command paths, including nested', () => {
      program.register(new ClientCommand());

      expect(program.getCommandPaths()).toEqual(['client']);
      expect(program.getCommandPaths(true)).toEqual(['client', 'client:build', 'client:install']);
    });

    it('emits `onCommandRegistered` event', () => {
      const spy = jest.fn();
      const cmd = new ClientCommand();

      program.onCommandRegistered.listen(spy);
      program.register(cmd);

      expect(spy).toHaveBeenCalledWith('client', cmd);
    });

    it('emits `onCommandRegistered` event for index command', () => {
      const spy = jest.fn();
      const cmd = new ClientCommand();

      program.onCommandRegistered.listen(spy);
      program.index(cmd);

      expect(spy).toHaveBeenCalledWith('client', cmd);
    });
  });

  describe('version', () => {
    it('outputs version when `--version` is passed', async () => {
      program.index(new BoostCommand());

      const exitCode = await program.run(['--version']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it('outputs version when `-v` is passed', async () => {
      program.index(new BoostCommand());

      const exitCode = await program.run(['-v']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe('locale', () => {
    it('errors for invalid `--locale`', async () => {
      program.index(new BuildCommand());

      const exitCode = await program.run(['--locale', 'wtf']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });
  });

  describe('help', () => {
    class HelpCommand extends Command {
      static description = 'Description';

      static path = 'boost';

      static options = options;

      static params = params;

      run() {
        return Promise.resolve();
      }
    }

    it('outputs help when `--help` is passed', async () => {
      program.index(new HelpCommand());

      const exitCode = await program.run(['--help']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it('outputs help when `-h` is passed', async () => {
      program.index(new HelpCommand());

      const exitCode = await program.run(['-h']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it('outputs help for a specific command', async () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      await program.run(['build', '-h']);

      expect(stdout.get()).toMatchSnapshot();

      await program.run(['install', '--help']);

      expect(stdout.get()).toMatchSnapshot();
    });

    it('outputs help for a nested sub-command', async () => {
      program.register(new ClientCommand());

      await program.run(['client:build', '-h']);

      expect(stdout.get()).toMatchSnapshot();

      await program.run(['client:install', '--help']);

      expect(stdout.get()).toMatchSnapshot();

      await program.run(['client', '--help']);

      expect(stdout.get()).toMatchSnapshot();
    });

    it('emits `onHelp` event', async () => {
      const spy = jest.fn();

      program.onHelp.listen(spy);
      program.register(new HelpCommand());

      await program.run(['boost', '--help']);

      expect(spy).toHaveBeenCalled();
    });

    it('emits `onHelp` event for index', async () => {
      const spy = jest.fn();

      program.onHelp.listen(spy);
      program.index(new HelpCommand());

      await program.run(['--help']);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('index', () => {
    it('executes index when no args passed', async () => {
      program.index(new BuildCommand());

      const exitCode = await program.run([]);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it('renders commands when no args passed', async () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      const exitCode = await program.run([]);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe('failure', () => {
    it('renders when no commands have been registered', async () => {
      const exitCode = await program.run(['build']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders when invalid command name passed', async () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      const exitCode = await program.run(['prune']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders when misspelt command name passed', async () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      const exitCode = await program.run(['buld']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders when no commands could be found', async () => {
      program.register(new BuildCommand());
      program.register(new InstallCommand());

      const exitCode = await program.run(['--locale=en']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders when args parsing fails', async () => {
      program.index(new BoostCommand());

      const exitCode = await program.run(['--foo']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders if an error is thrown', async () => {
      program.register(new ErrorCommand());

      const exitCode = await program.run(['boost']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders with custom exit error', async () => {
      class ExitCommand extends Command {
        static description = 'Description';

        static path = 'boost';

        run() {
          this.exit('Oops', 123);

          return Promise.resolve();
        }
      }

      program.register(new ExitCommand());

      const exitCode = await program.run(['boost']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(123);
    });

    it('emits `onBeforeRun` and `onAfterRun` events', async () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      program.onBeforeRun.listen(beforeSpy);
      program.onAfterRun.listen(afterSpy);

      program.register(new ErrorCommand());

      await program.run(['boost']);

      expect(beforeSpy).toHaveBeenCalledWith(['boost']);
      expect(afterSpy).toHaveBeenCalledWith(new Error('Broken!'));
    });

    it('emits `onCommandNotFound` event', async () => {
      const spy = jest.fn();

      program.onCommandNotFound.listen(spy);
      program.register(new BuildCommand());

      await program.run(['install', 'foo', 'bar']);

      expect(spy).toHaveBeenCalledWith(['install', 'foo', 'bar'], 'install');
    });
  });

  describe('success', () => {
    beforeEach(() => {
      process.env.BOOSTJS_CLI_FAIL_HARD = 'true';
    });

    afterEach(() => {
      delete process.env.BOOSTJS_CLI_FAIL_HARD;
    });

    it('sets rest args to the rest command property', async () => {
      const command = new BuildCommand();

      program.register(command);

      await program.run(['build', '-S', './src', '--', 'foo', 'bar', '--baz', '-f']);

      expect(command.rest).toEqual(['foo', 'bar', '--baz', '-f']);
    });

    it('sets options as command properties (declarative)', async () => {
      const command = new BuildCommand();

      program.register(command);

      await program.run(['build', '-S', './source', '-D', './library']);

      expect(command.dst).toBe('./library');
      expect(command.help).toBe(false);
      expect(command.locale).toBe('en');
      expect(command.src).toBe('./source');
      expect(command.version).toBe(false);
    });

    it('sets options as command properties (imperative)', async () => {
      const command = new BuildClassicCommand();

      program.register(command);

      await program.run(['build', '-S', './source']);

      expect(command.dst).toBe('');
      expect(command.help).toBe(false);
      expect(command.locale).toBe('en');
      expect(command.src).toBe('./source');
      expect(command.version).toBe(false);
    });

    it('passes params to run method', async () => {
      const command = new AllClassicCommand();
      const spy = jest.spyOn(command, 'run');

      program.index(command);

      await program.run(['-F', 'foo', 'true', '123']);

      expect(spy).toHaveBeenCalledWith('foo', true, 123);
    });

    it('calls bootstrap method before running', async () => {
      const command = new AllClassicCommand();
      const spy = jest.spyOn(command, 'bootstrap');

      program.index(command);

      await program.run(['foo']);

      expect(spy).toHaveBeenCalled();
    });

    it('can return nothing', async () => {
      class NoneCommand extends Command {
        static description = 'Description';

        static path = 'none';

        run() {}
      }

      program.register(new NoneCommand());

      await program.run(['none']);

      expect(stdout.get()).toBe('');
    });

    it('can return a string that writes directly to stream', async () => {
      program.register(new StringCommand());

      await program.run(['string']);

      expect(stdout.get()).toBe('Hello!');
    });

    it('can return an element that writes with ink', async () => {
      program.register(new ComponentCommand());

      await program.run(['comp']);

      expect(stdout.get()).toMatchSnapshot();
    });

    it('emits `onBeforeRun` and `onAfterRun` events', async () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      program.onBeforeRun.listen(beforeSpy);
      program.onAfterRun.listen(afterSpy);
      program.register(new BoostCommand());

      await program.run(['boost', 'foo', 'bar']);

      expect(beforeSpy).toHaveBeenCalledWith(['boost', 'foo', 'bar']);
      expect(afterSpy).toHaveBeenCalled();
    });

    it('emits `onCommandFound` event', async () => {
      const spy = jest.fn();
      const cmd = new BoostCommand();

      program.onCommandFound.listen(spy);
      program.register(cmd);

      await program.run(['boost', 'foo', 'bar']);

      expect(spy).toHaveBeenCalledWith(['boost', 'foo', 'bar'], 'boost', cmd);
    });

    it('emits `onBeforeRender` and `onAfterRender` events for components', async () => {
      const beforeSpy = jest.fn();
      const afterSpy = jest.fn();

      program.onBeforeRender.listen(beforeSpy);
      program.onAfterRender.listen(afterSpy);
      program.index(new ComponentCommand());

      await program.run([]);

      expect(beforeSpy).toHaveBeenCalledWith(<Box>Hello!</Box>);
      expect(afterSpy).toHaveBeenCalled();
    });
  });

  describe('option defaults', () => {
    class DeclCommand extends Command {
      static description = 'Description';

      static path = 'cmd';

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
      static description = 'Description';

      static path = 'cmd';

      static options: OptionConfigMap = {
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

          process.env.BOOSTJS_CLI_FAIL_HARD = 'true';
        });

        afterEach(() => {
          delete process.env.BOOSTJS_CLI_FAIL_HARD;
        });

        it('returns number option if defined', async () => {
          program.register(command);

          await program.run(['cmd', '--numNoDefault', '456', '--numWithDefault=789']);

          expect(command.numNoDefault).toBe(456);
          expect(command.numWithDefault).toBe(789);
        });

        it('returns default number option if not defined', async () => {
          program.register(command);

          await program.run(['cmd']);

          expect(command.numNoDefault).toBe(0);
          expect(command.numWithDefault).toBe(123);
        });

        it('returns boolean option if defined', async () => {
          program.register(command);

          await program.run(['cmd', '--flagFalse', '--no-flagTrue']);

          expect(command.flagFalse).toBe(true);
          expect(command.flagTrue).toBe(false);
        });

        it('returns default boolean option if not defined', async () => {
          program.register(command);

          await program.run(['cmd']);

          expect(command.flagFalse).toBe(false);
          expect(command.flagTrue).toBe(true);
        });

        it('returns string option if defined', async () => {
          program.register(command);

          await program.run(['cmd', '--strNoDefault', 'bar', '--strWithDefault=baz']);

          expect(command.strNoDefault).toBe('bar');
          expect(command.strWithDefault).toBe('baz');
        });

        it('returns default string option if not defined', async () => {
          program.register(command);

          await program.run(['cmd']);

          expect(command.strNoDefault).toBe('');
          expect(command.strWithDefault).toBe('foo');
        });

        it('returns numbers option if defined', async () => {
          program.register(command);

          await program.run([
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

          await program.run(['cmd']);

          expect(command.numsNoDefault).toEqual([]);
          expect(command.numsWithDefault).toEqual([1, 2, 3]);
        });

        it('returns strings option if defined', async () => {
          program.register(command);

          await program.run([
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

          await program.run(['cmd']);

          expect(command.strsNoDefault).toEqual([]);
          expect(command.strsWithDefault).toEqual(['a', 'b', 'c']);
        });
      });
    });
  });

  describe('logging', () => {
    function Log() {
      const ctx = useContext(ProgramContext) as ProgramContextType;

      ctx.log('Component log');
      ctx.log.error('Component error');

      console.log('Console component log');
      console.error('Console component error');

      return <Box>Returned from component!</Box>;
    }

    class LogCommand extends Command {
      static description = 'Description';

      static path = 'log';

      static options: OptionConfigMap = {
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

        console.log('Console log');
        console.error('Console error');

        if (this.component) {
          return <Log />;
        }

        return 'Returned from command!';
      }
    }

    it('captures console and logger logs when rendering a component', async () => {
      program.register(new LogCommand());

      const exitCode = await program.run(['log', '--component']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it('captures console and logger logs when returning a string', async () => {
      program.register(new LogCommand());

      const exitCode = await program.run(['log']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });
});
