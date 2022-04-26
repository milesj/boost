const { Command } = require('../../cjs/index.cjs');

module.exports = class ParamsCommand extends Command {
	static description = 'List of all possible param types';

	static path = 'pms';

	static category = 'feature';

	static params = [
		{
			description: 'String',
			label: 'name',
			required: true,
			type: 'string',
		},
		{
			default: 18,
			description: 'Number',
			label: 'age',
			type: 'number',
		},
		{
			description: 'Boolean',
			label: 'active',
			type: 'boolean',
		},
	];

	run() {
		//
	}
};
