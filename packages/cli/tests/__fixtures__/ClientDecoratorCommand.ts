import { Command, Config } from '../../src';
import { BuildDecoratorCommand } from './BuildDecoratorCommand';
import { InstallInitializerCommand } from './InstallInitializerCommand';
import { InstallPropsCommand } from './InstallPropsCommand';

class ClientBuildCommand extends BuildDecoratorCommand {
	static override path = 'client:build';

	static override category = 'build';

	static override aliases = ['client:compile'];
}

class ClientInstallCommand extends InstallPropsCommand {
	static override path = 'client:install';

	static override category = 'setup';

	static override aliases = ['client:up'];
}

class ClientUninstallCommand extends InstallInitializerCommand {
	static override path = 'client:uninstall';

	static override category = 'teardown';

	static override aliases = ['client:down'];
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
export class ClientDecoratorCommand extends Command {
	constructor() {
		super();

		this.register(new ClientBuildCommand());
		this.register(new ClientInstallCommand());
		this.register(new ClientUninstallCommand());
	}

	async run() {
		await Promise.resolve();

		return 'Run sub-command!';
	}
}
