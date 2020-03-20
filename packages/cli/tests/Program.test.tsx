import { ExitError } from '@boost/internal';
import { Program, Command } from '../src';
import { WriteStream, ReadStream } from './helpers';
import { Parent, Child, GrandChild } from './__mocks__/commands';
import BuildCommand from './__mocks__/BuildCommand';

// waitUntilExit() never resolves, so we need to mock the entire module ;/
jest.mock('ink', () => {
  const { render, Box, Color, Static } = require.requireActual('ink');

  return {
    Box,
    Color,
    Static,
    render(element: any, options: any) {
      return {
        waitUntilExit() {
          try {
            render(element, options);
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

    it('returns nested commands by drilling down paths', () => {
      const parent = new Parent();
      const child = new Child();
      const grand = new GrandChild();

      child.register(grand);
      parent.register(child);
      program.register(parent);

      expect(program.getCommand('parent:child:grandchild')).toBe(grand);
    });
  });

  describe('running', () => {
    it('renders failure when no commands have been registered', async () => {
      const exitCode = await program.run(['build']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders failure when single command has mismatched names', async () => {
      program.register(new BuildCommand());

      const exitCode = await program.run(['build']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders failure when args parsing fails', async () => {
      program.register(new BoostCommand());

      const exitCode = await program.run(['--foo']);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(1);
    });

    it('renders failure with custom exit error', async () => {
      class ExitCommand extends Command {
        static description = 'Description';

        static path = 'boost';

        run() {
          this.exit('Oops', 123);

          return Promise.resolve();
        }
      }

      program.register(new ExitCommand());

      const exitCode = await program.run([]);

      expect(stdout.get()).toMatchSnapshot();
      expect(exitCode).toBe(123);
    });
  });
});
