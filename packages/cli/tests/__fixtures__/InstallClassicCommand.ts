import { Categories, Command, GlobalOptions, Options, Params } from '../../src';

export interface InstallOptions extends GlobalOptions {
	save: boolean;
}

export type InstallParams = [string, ...string[]];

export class InstallClassicCommand extends Command<InstallOptions, InstallParams> {
	static override path = 'install';

	static override description = 'Install package(s)';

	static override deprecated = true;

	static override hidden = true;

	static override category = 'setup';

	static override categories: Categories = {
		special: 'Special',
	};

	static override options: Options<InstallOptions> = {
		// --save
		save: {
			category: 'special',
			default: true,
			description: 'Save dependency to lock file',
			type: 'boolean',
		},
	};

	static override params: Params<InstallParams> = [
		{
			description: 'Package name',
			label: 'pkg',
			required: true,
			type: 'string',
		},
	];

	static override allowVariadicParams = 'pkgs';

	save: boolean = true;

	async run(pkgName: string, ...morePkgNames: string[]) {
		await Promise.resolve();

		return 'Install!';
	}
}
