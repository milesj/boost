import { Command, GlobalOptions, Options, Params } from '../../src';

export interface InstallOptions extends GlobalOptions {
  save: boolean;
}

export type InstallParams = [string, ...string[]];

export default class InstallClassicCommand extends Command<InstallOptions, InstallParams> {
  static path = 'install';

  static description = 'Install package(s)';

  static deprecated = true;

  static hidden = true;

  static options: Options<InstallOptions> = {
    // --save
    save: {
      default: true,
      description: 'Save dependency to lock file',
      type: 'boolean',
    },
  };

  static params: Params<InstallParams> = [
    {
      description: 'Package name',
      label: 'pkg',
      required: true,
      type: 'string',
    },
  ];

  save: boolean = true;

  async run(pkgName: string, ...morePkgNames: string[]) {
    await Promise.resolve();

    return 'Install!';
  }
}
