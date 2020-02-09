import { Arg, Command, Config, GlobalArgumentOptions } from '../../src';

export interface BuildOptions extends GlobalArgumentOptions {
  dst: string;
  src: string;
}

@Config('build', 'Build a project', { usage: '$ build -S ./src -D ./lib' })
class BuildCommand extends Command<BuildOptions> {
  // --dst, -D
  @Arg.String('Destination path', { short: 'D' })
  dst: string = '';

  // --src, -S
  @Arg.String('Source path', { short: 'S' })
  src: string = './src';

  async run() {
    await Promise.resolve();

    return 'Build!';
  }
}

export default BuildCommand;
