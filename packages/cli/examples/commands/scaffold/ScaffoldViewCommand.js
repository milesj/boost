const { Command } = require('../../../cjs/index.cjs');

module.exports = class ScaffoldViewCommand extends Command {
	static description = 'Scaffold a view';

	static path = 'scaffold:view';

	async run() {
		this.log('Scaffolded');
	}
};
