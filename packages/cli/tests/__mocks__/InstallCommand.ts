import { Arg, Config, Command, GlobalOptions } from '../../src';

export interface InstallOptions extends GlobalOptions {
  save: boolean;
}

export type InstallParams = [string, ...string[]];

@Config('install', 'Install package(s)', {
  categories: { special: 'Special' },
  category: 'setup',
  deprecated: true,
  hidden: true,
})
export default class InstallCommand extends Command<InstallOptions, InstallParams> {
  // --save
  @Arg.Flag('Save dependency to lock file', { category: 'special' })
  save: boolean = true;

  @Arg.Params<InstallParams>({
    description: 'Package name',
    label: 'pkg',
    required: true,
    type: 'string',
  })
  async run(pkgName: string, ...morePkgNames: string[]) {
    await Promise.resolve();

    return 'Install!';
  }
}
