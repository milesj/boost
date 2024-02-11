import { Command } from '../../../mjs/index.mjs';

export default class ScaffoldViewCommand extends Command {
	static description = 'Scaffold a view';

	static path = 'scaffold:view';

	async run() {
		this.log('Scaffolded');
	}
}
