import { Arg, Command, type GlobalOptions } from '../../src';

export interface AllOptions extends GlobalOptions {
	flag: boolean;
	num: number;
	nums: number[];
	str: string;
	strs: string[];
}

export type AllParams = [string, boolean, number];

export class AllInitializerCommand extends Command<AllOptions, AllParams> {
	static override path = 'all';

	static override description = 'All options and params';

	static override params = Arg.params<AllParams>(
		{
			description: 'String',
			label: 'char',
			required: true,
			type: 'string',
		},
		{
			default: true,
			description: 'Boolean',
			type: 'boolean',
		},
		{
			default: 123,
			description: 'Number',
			label: 'int',
			type: 'number',
		},
	);

	// --flag, -F
	flag = Arg.flag('Boolean flag', { default: true, short: 'F' });

	// --num, -N
	num = Arg.number('Single number', { count: true, short: 'N' });

	// --nums
	nums = Arg.numbers('List of numbers', { deprecated: true });

	// --str
	str = Arg.string('Single string', { default: 'a', choices: ['a', 'b', 'c'], hidden: true });

	// --strs, -S
	strs = Arg.strings('List of strings', {
		arity: 5,
		short: 'S',
		validate() {
			throw new Error('Oh no...');
		},
	});

	async run(str: string, bool: boolean, num: number) {
		await Promise.resolve();

		return 'All the things!';
	}
}
