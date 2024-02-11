import { Command } from '../../../mjs/index.mjs';

export default class ScaffoldModelCommand extends Command {
	static description = 'Scaffold a model';

	static path = 'scaffold:model';

	async run() {
		this.log('Scaffolded');
	}
}
