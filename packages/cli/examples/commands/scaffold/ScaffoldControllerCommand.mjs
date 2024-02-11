import { Command } from '../../../mjs/index.mjs';

export default class ScaffoldControllerCommand extends Command {
	static description = 'Scaffold a controller';

	static path = 'scaffold:controller';

	async run() {
		this.log('Scaffolded');
	}
}
