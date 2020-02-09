import { Command, GlobalArgumentOptions } from '../../src';

export interface BuildOptions extends GlobalArgumentOptions {
  dst: string;
  src: string;
}

export default class BuildClassicCommand extends Command<BuildOptions> {
  static description = 'Build a project';

  static path = 'build';

  static usage = '$ build -S ./src -D ./lib';

  dst: string = '';

  src: string = './src';

  bootstrap() {
    this.registerOptions({
      dst: {
        description: 'Destination path',
        type: 'string',
      },
      src: {
        description: 'Source path',
        type: 'string',
      },
    });
  }

  async run() {
    await Promise.resolve();

    return 'Build!';
  }
}
