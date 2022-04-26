const { Command } = require('../../../cjs/index.cjs');

module.exports = class ScaffoldControllerCommand extends Command {
	static description = 'Scaffold a controller';

	static path = 'scaffold:controller';

	async run() {
		this.log('Scaffolded');
	}
};
