import { Command, GlobalArgumentOptions, Options } from '../../src';

export interface BuildOptions extends GlobalArgumentOptions {
  dst: string;
  src: string;
}

export default class BuildClassicCommand extends Command<BuildOptions> {
  static path = 'build';

  static description = 'Build a project';

  static usage = '$ build -S ./src -D ./lib';

  static options: Options<BuildOptions> = {
    // --dst, -D
    dst: {
      description: 'Destination path',
      short: 'D',
      type: 'string',
    },
    // --src, -S
    src: {
      description: 'Source path',
      short: 'S',
      type: 'string',
    },
  };

  dst: string = '';

  src: string = './src';

  async run() {
    await Promise.resolve();

    return 'Build!';
  }
}
