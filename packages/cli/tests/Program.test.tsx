import { ExitError } from '@boost/internal';
import { Program, Command } from '../src';
import { WriteStream, ReadStream } from './helpers';
import { options, params } from './__mocks__/args';
import { Parent, Child, GrandChild } from './__mocks__/commands';
import BuildCommand from './__mocks__/BuildCommand';
import InstallCommand from './__mocks__/InstallCommand';
import ClientCommand from './__mocks__/ClientCommand';

// waitUntilExit() never resolves, so we need to mock the entire module ;/
jest.mock('ink', () => {
  const { render, Box, Color, Static } = require.requireActual('ink');

  return {
    Box,
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
      }).toThrow('A command has already been registered with the canonical path "build".');
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
      class ErrorCommand extends Command {
        static description = 'Description';

        static path = 'boost';

        run(): Promise<void> {
          throw new Error('Broken!');
        }
      }

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
  });
});
