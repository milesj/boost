/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	Arg,
	Category,
	COMMAND_FORMAT,
	Config,
	DEFAULT_BOOLEAN_VALUE,
	DEFAULT_NUMBER_VALUE,
	DEFAULT_STRING_VALUE,
	Flag,
	MultipleOption,
	Option,
	ParamConfig,
	PrimitiveType,
	ShortOptionName,
	SingleOption,
} from '@boost/args';
import { Blueprint, schemas } from '@boost/common/optimal';
import { CommandStaticConfig } from '../types';

const { array, bool, func, number, object, shape, string, union } = schemas;

export const commonBlueprint: Blueprint<Config> = {
	deprecated: bool(),
	description: string().notEmpty().required(),
	hidden: bool(),
};

// COMMANDS

export const commandConstructorBlueprint: Blueprint<
	Partial<Omit<CommandStaticConfig, 'options' | 'params'>>
> = {
	...commonBlueprint,
	aliases: array().of(string()),
	allowUnknownOptions: bool(),
	allowVariadicParams: union<boolean | string>(false).of([bool(), string()]),
	categories: object().of(
		union<Category | string>('').of([
			string().notEmpty(),
			shape({
				name: string().notEmpty(),
				weight: number(),
			}),
		]),
	),
	category: string(),
	hasRegisteredOptions: string(),
	path: string().notEmpty().required().match(COMMAND_FORMAT),
	usage: union<string[] | string>([]).of([string(), array().of(string())]),
};

// ARGS

export const argBlueprint: Blueprint<Arg<any>> = {
	...commonBlueprint,
	default: union<PrimitiveType>('').of([bool(), number(), string()]),
	format: func(),
	type: string<'boolean' | 'number' | 'string'>('string').required(),
	validate: func(),
};

// OPTIONS

export const optionBlueprint: Blueprint<Option<any>> = {
	...argBlueprint,
	category: string(),
	short: string<ShortOptionName>().when(
		// @ts-expect-error Ignore types
		(value) => value !== '',
		string().match(/^[a-z]$/giu),
	),
};

export const flagBlueprint: Blueprint<Flag> = {
	...optionBlueprint,
	default: bool(DEFAULT_BOOLEAN_VALUE),
	type: string().oneOf(['boolean']),
};

export const stringOptionBlueprint: Blueprint<SingleOption<string>> = {
	...optionBlueprint,
	choices: array().of(string()),
	count: bool().never(),
	default: string(DEFAULT_STRING_VALUE),
	type: string().oneOf(['string']),
};

export const stringsOptionBlueprint: Blueprint<MultipleOption<string[]>> = {
	...optionBlueprint,
	arity: number(),
	default: array().of(string()),
	multiple: bool().onlyTrue(),
	type: string().oneOf(['string']),
};

export const numberOptionBlueprint: Blueprint<SingleOption<number>> = {
	...optionBlueprint,
	choices: array().of(number()),
	count: bool().onlyTrue(),
	default: number(DEFAULT_NUMBER_VALUE),
	type: string().oneOf(['number']),
};

export const numbersOptionBlueprint: Blueprint<MultipleOption<number[]>> = {
	...optionBlueprint,
	arity: number(),
	default: array().of(number()),
	multiple: bool().onlyTrue(),
	type: string().oneOf(['number']),
};

// PARAMS

export const paramBlueprint: Blueprint<ParamConfig> = {
	...argBlueprint,
	label: string(),
	required: bool(),
	validate: func(),
};
