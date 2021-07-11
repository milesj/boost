import { Command, Config } from '../../src';
import { BuildCommand } from './BuildCommand';
import { InstallClassicCommand } from './InstallClassicCommand';

class ClientBuildCommand extends BuildCommand {
	static path = 'client:build';

	static category = 'build';

	static aliases = ['client:compile'];
}

class ClientInstallCommand extends InstallClassicCommand {
	static path = 'client:install';

	static category = 'setup';

	static aliases = ['client:compile'];
}

@Config('client', 'Client', {
	allowUnknownOptions: true,
	categories: {
		build: 'Build',
		setup: {
			name: 'Setup',
			weight: 10,
		},
	},
	usage: ['client:install @foo/bar', 'client:build'],
})
export class ClientCommand extends Command {
	constructor() {
		super();

		this.register(new ClientBuildCommand());
		this.register(new ClientInstallCommand());
		this.register(
			'client:uninstall',
			{
				category: 'setup',
				description: 'Uninstall a package',
			},
			() => {},
		);
	}

	async run() {
		await Promise.resolve();

		return 'Run sub-command!';
	}
}
