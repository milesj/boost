import type { CommandConfigMap, OptionConfigMap, ParamConfigList } from '../../src';

export const commands: CommandConfigMap = {
	foo: {
		description: 'This is a normal command with params.',
		params: [
			{ description: '', label: 'src', required: true, type: 'string' },
			{ description: '', label: 'dst', type: 'string' },
		],
	},
	barbar: {
		deprecated: true,
		description: 'This is a deprecated command with no params.',
	},
	baz: {
		description: 'This is a hidden command.',
		hidden: true,
	},
};

export const options: OptionConfigMap = {
	str: {
		description: 'Standard string option.',
		type: 'string',
	},
	deprecatedStringWithALongName: {
		deprecated: true,
		description: 'Deprecated string option with custom label.',
		type: 'string',
	},
	flag: {
		description: 'Standard boolean option.',
		type: 'boolean',
	},
	stringChoices: {
		choices: ['foo', 'bar', 'baz'],
		default: 'bar',
		description: 'Choice list with strings.',
		short: 's',
		type: 'string',
	},
	numberFixedList: {
		choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		deprecated: true,
		description: 'A list of numbers to choose from.',
		short: 'n',
		type: 'number',
	},
	numHidden: {
		hidden: true,
		description: 'Hidden number option.',
		type: 'number',
	},
	numberCountable: {
		count: true,
		default: 10,
		description: 'Number option that increments a count for each occurence.',
		short: 'C',
		type: 'number',
	},
	deprecatedFlag: {
		deprecated: true,
		description: 'A deprecated flag.',
		type: 'boolean',
	},
	numWithArity: {
		arity: 10,
		description: 'A multiple number option that requires an exact number of values.',
		multiple: true,
		type: 'number',
	},
	strList: {
		description: 'String option list.',
		multiple: true,
		short: 'S',
		type: 'string',
	},
	truthyBool: {
		default: true,
		description: 'Flag that is on by default, so name should be negated.',
		short: 't',
		type: 'boolean',
	},
	num: {
		description: 'Standard number option.',
		type: 'number',
	},
};

export const params: ParamConfigList = [
	{
		deprecated: true,
		description: 'Complex param with many tags.',
		type: 'string',
		required: true,
	},
	{
		description: 'This is a string param thats required.',
		label: 'path',
		type: 'string',
		required: true,
	},
	{
		description: 'And this a number param with a label.',
		label: 'ms',
		type: 'number',
	},
	{
		deprecated: true,
		description: 'And finally a boolean param.',
		type: 'boolean',
	},
	{
		description: 'This should be hidden.',
		hidden: true,
		type: 'boolean',
	},
];
