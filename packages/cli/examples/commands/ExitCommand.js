const { Command } = require('../../lib');
const sleep = require('../sleep');

module.exports = class ExitCommand extends Command {
	static description = 'Test exiting the program';

	static path = 'exit';

	static category = 'test';

	static options = {
		error: {
			description: 'Throw an error',
			type: 'boolean',
		},
	};

	async run() {
		console.log('Will exit in 3 seconds...');

		await sleep(3000);

		if (this.error) {
			this.exit('Failed!');
		} else {
			this.exit();
		}
	}
};
