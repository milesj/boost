const { Command } = require('../../cjs/index.cjs');
const ScaffoldControllerCommand = require('./scaffold/ScaffoldControllerCommand');
const ScaffoldModelCommand = require('./scaffold/ScaffoldModelCommand');
const ScaffoldViewCommand = require('./scaffold/ScaffoldViewCommand');

module.exports = class ScaffoldCommand extends Command {
	static description = 'Scaffold files based on a template';

	static path = 'scaffold';

	constructor() {
		super();

		this.register(new ScaffoldControllerCommand())
			.register(new ScaffoldModelCommand())
			.register(new ScaffoldViewCommand());
	}

	async run() {
		return this.renderHelp();
	}
};
