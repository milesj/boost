import { Command, Meta, Arg, GlobalArgumentOptions } from '../src';

describe('Command', () => {
  interface Args extends GlobalArgumentOptions {}

  @Meta('test', 'A test command', { deprecated: true })
  class TestCommand extends Command<Args> {
    @Arg.String('Test')
    foo: string = 'foo';

    @Arg.Params()
    execute(...params: string[]) {
      return Promise.resolve();
    }
  }

  @Meta('foo', 'A sub-command')
  class FooCommand extends Command<Args, [string, number, boolean]> {
    @Arg.Params<[string, number, boolean]>(
      { description: '', type: 'string' },
      { description: '', type: 'number' },
      { description: '', type: 'boolean' },
    )
    execute(a: string, b: number, c: boolean) {
      return Promise.resolve();
    }
  }

  it('tests', () => {
    const command = new TestCommand();
    command.registerCommand(new FooCommand());

    console.log(command.getMetadata());
  });
});
