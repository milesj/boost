import Command from './Command';
import StringOption from './StringOption';
import StringsOption from './StringsOption';
import NumberOption from './NumberOption';
import NumbersOption from './NumbersOption';
import Flag from './Flag';
import Params from './Params';
import Rest from './Rest';

export default class ExampleCommand extends Command {
  // --foo value, -f
  @StringOption('Description', { short: 'f' })
  foo: string = '';

  // --foos value value, -F
  @StringsOption('Description', {
    short: 'F',
    validate(value) {
      if (!value) {
        throw new Error('Whoops');
      }
    },
  })
  foos: string[] = [];

  // --bar 123, -b
  @NumberOption('Description', { count: true, short: 'b' })
  bar: number = 0;

  // --bars 1 2 3, -B
  @NumbersOption('Description', { arity: 10, short: 'B' })
  bars: number[] = [];

  // --help
  @Flag('Help menu', { short: 'h' })
  help: boolean = false;

  // foo bar baz
  @Params()
  files: string[] = [];

  // --choice bar
  @StringOption('Description', { choices: ['foo', 'bar', 'baz'] })
  choice: string = '';

  // -- foo bar baz
  @Rest
  rest: string[] = [];

  constructor() {
    super();

    this.registerOption('foo', '', {
      description: 'Description',
      short: 'f',
      type: 'string',
    });

    this.registerFlag('help', {
      description: 'Help menu',
      short: 'h',
    });
  }
}
