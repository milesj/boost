import { Command } from '../../mjs/index.mjs';

export default class OptionsCommand extends Command {
	static description = 'List of all possible option types';

	static path = 'opts';

	static category = 'feature';

	static options = {
		flag: {
			description: 'Boolean flag',
			type: 'boolean',
		},
		number: {
			count: true,
			description: 'Single number',
			short: 'N',
			type: 'number',
		},
		numbers: {
			deprecated: true,
			description: 'List of numbers',
			multiple: true,
			type: 'number',
		},
		string: {
			choices: ['a', 'b', 'c'],
			default: 'a',
			description: 'Single string',
			hidden: true,
			type: 'string',
		},
		strings: {
			arity: 5,
			description: 'List of strings',
			multiple: true,
			short: 'S',
			type: 'string',
		},
	};

	run() {
		//
	}
}
