import { Command, GlobalOptions, Options, Params } from '../../src';

export interface AllOptions extends GlobalOptions {
	flag: boolean;
	num: number;
	nums: number[];
	str: string;
	strs: string[];
}

export type AllParams = [string, boolean, number];

export default class AllClassicCommand extends Command<AllOptions, AllParams> {
	static path = 'all';

	static description = 'All options and params';

	static options: Options<AllOptions> = {
		// --flag, -F
		flag: {
			description: 'Boolean flag',
			short: 'F',
			type: 'boolean',
		},
		// --num, -N
		num: {
			count: true,
			description: 'Single number',
			short: 'N',
			type: 'number',
		},
		// --nums
		nums: {
			deprecated: true,
			description: 'List of numbers',
			multiple: true,
			type: 'number',
		},
		// --str
		str: {
			choices: ['a', 'b', 'c'],
			description: 'Single string',
			hidden: true,
			type: 'string',
		},
		// --strs, -S
		strs: {
			arity: 5,
			description: 'List of strings',
			multiple: true,
			short: 'S',
			type: 'string',
			validate() {
				// throw new Error('Oh no...');
			},
		},
	};

	static params: Params<AllParams> = [
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
	];

	flag: boolean = false;

	num: number = 0;

	nums: number[] = [];

	str: string = 'a';

	strs: string[] = [];

	async run(str: string, bool: boolean, num: number) {
		await Promise.resolve();

		return 'All the things!';
	}
}
