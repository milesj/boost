import { Command } from '../../mjs/index.mjs';
import ScaffoldControllerCommand from './scaffold/ScaffoldControllerCommand.mjs';
import ScaffoldModelCommand from './scaffold/ScaffoldModelCommand.mjs';
import ScaffoldViewCommand from './scaffold/ScaffoldViewCommand.mjs';

export default class ScaffoldCommand extends Command {
	static description = 'Scaffold files based on a template';

	static path = 'scaffold';

	constructor() {
		super();

		this.register(new ScaffoldControllerCommand())
			.register(new ScaffoldModelCommand())
			.register(new ScaffoldViewCommand());
	}

	async run() {
		return this.render(await this.createHelp());
	}
}
