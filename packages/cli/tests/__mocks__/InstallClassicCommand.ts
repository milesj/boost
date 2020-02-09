import { Command, GlobalArgumentOptions } from '../../src';

export interface InstallOptions extends GlobalArgumentOptions {
  save: boolean;
}

export type InstallParams = [string, ...string[]];

export default class InstallClassicCommand extends Command<InstallOptions, InstallParams> {
  static deprecated = true;

  static description = 'Install package(s)';

  static hidden = true;

  static path = 'install';

  // --save
  save: boolean = true;

  constructor() {
    super();

    this.registerOptions({
      save: {
        default: true,
        description: 'Save dependency to lock file',
        type: 'boolean',
      },
    });

    this.registerParams([
      {
        description: 'Package name',
        label: 'pkg',
        required: true,
        type: 'string',
      },
    ]);
  }

  async run(pkgName: string, ...morePkgNames: string[]) {
    await Promise.resolve();

    return 'Install!';
  }
}
