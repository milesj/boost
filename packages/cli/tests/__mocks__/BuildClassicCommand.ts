import { Command, GlobalArgumentOptions } from '../../src';

export interface BuildOptions extends GlobalArgumentOptions {
  dst: string;
  src: string;
}

export default class BuildClassicCommand extends Command<BuildOptions> {
  static description = 'Build a project';

  static path = 'build';

  static usage = '$ build -S ./src -D ./lib';

  // --dst, -D
  dst: string = '';

  // --src, -S
  src: string = './src';

  constructor() {
    super();

    this.registerOptions({
      dst: {
        description: 'Destination path',
        short: 'D',
        type: 'string',
      },
      src: {
        description: 'Source path',
        short: 'S',
        type: 'string',
      },
    });
  }

  async run() {
    await Promise.resolve();

    return 'Build!';
  }
}
