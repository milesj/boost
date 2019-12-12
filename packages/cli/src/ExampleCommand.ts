import Command from './Command';
import StringOption from './StringOption';
import Params from './Params';

export default class ExampleCommand extends Command {
  @StringOption('Some description!')
  foo: string = '';

  @Params()
  files: string[] = [];
}
