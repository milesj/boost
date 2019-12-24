import { Command, Name, Arg } from '../src';

describe('Command', () => {
  @Name('test')
  class TestCommand extends Command {
    @Arg.String('Test')
    foo: string = 'foo';
  }

  @Name('foo')
  class FooCommand extends Command {}

  it('tests', () => {
    const command = new TestCommand();
    command.registerCommand(new FooCommand());

    console.log(command.getMetadata());
  });
});
