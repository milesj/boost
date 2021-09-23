import { Arg, Command, Config, GlobalOptions } from '../../src';

export interface AllOptions extends GlobalOptions {
	flag: boolean;
	num: number;
	nums: number[];
	str: string;
	strs: string[];
}

export type AllParams = [string, boolean, number];

@Config('all', 'All options and params')
export class AllDecoratorCommand extends Command<AllOptions, AllParams> {
	// --flag, -F
	@Arg.Flag('Boolean flag', { short: 'F' })
	flag: boolean = true;

	// --num, -N
	@Arg.Number('Single number', { count: true, short: 'N' })
	num: number = 0;

	// --nums
	@Arg.Numbers('List of numbers', { deprecated: true })
	nums: number[] = [];

	// --str
	@Arg.String('Single string', { choices: ['a', 'b', 'c'], hidden: true })
	str: string = 'a';

	// --strs, -S
	@Arg.Strings('List of strings', {
		arity: 5,
		short: 'S',
		validate() {
			throw new Error('Oh no...');
		},
	})
	strs: string[] = [];

	@Arg.Params<AllParams>(
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
	)
	async run(str: string, bool: boolean, num: number) {
		await Promise.resolve();

		return 'All the things!';
	}
}
