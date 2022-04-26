const { Command } = require('../../../cjs/index.cjs');

module.exports = class ScaffoldModelCommand extends Command {
	static description = 'Scaffold a model';

	static path = 'scaffold:model';

	async run() {
		this.log('Scaffolded');
	}
};
