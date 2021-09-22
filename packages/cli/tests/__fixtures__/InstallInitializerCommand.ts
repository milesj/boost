import { Arg, Categories, Command, GlobalOptions } from '../../src';

export interface InstallOptions extends GlobalOptions {
	save: boolean;
}

export type InstallParams = [string, ...string[]];

export class InstallInitializerCommand extends Command<InstallOptions, InstallParams> {
	static override path = 'install';

	static override description = 'Install package(s)';

	static override deprecated = true;

	static override hidden = false;

	static override category = 'setup';

	static override categories: Categories = {
		special: 'Special',
	};

	static override allowVariadicParams = 'pkgs';

	static override params = Arg.params<InstallParams>({
		description: 'Package name',
		label: 'pkg',
		required: true,
		type: 'string',
	});

	// --save
	save = Arg.flag('Save dependency to lock file', { default: true, category: 'special' });

	async run(pkgName: string, ...morePkgNames: string[]) {
		await Promise.resolve();

		return 'Install!';
	}
}
