/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Config,
  Arg,
  Option,
  SingleOption,
  MultipleOption,
  Flag,
  ShortOptionName,
  ParamConfig,
  DEFAULT_STRING_VALUE,
  DEFAULT_NUMBER_VALUE,
  DEFAULT_BOOLEAN_VALUE,
  COMMAND_FORMAT,
  Category,
} from '@boost/args';
import { predicates, Blueprint } from '@boost/common';
import { CommandStaticConfig } from '../types';

const { array, bool, func, number, object, shape, string, union } = predicates;

export const commonBlueprint: Blueprint<Required<Config>> = {
  deprecated: bool(),
  description: string()
    .notEmpty()
    .required(),
  hidden: bool(),
};

// COMMANDS

export const commandConstructorBlueprint: Blueprint<Omit<
  CommandStaticConfig,
  'options' | 'params'
>> = {
  ...commonBlueprint,
  aliases: array(string()),
  allowRestParams: union([bool(), string()], false),
  allowUnknownOptions: bool(),
  categories: object(
    union<string | Category>(
      [
        string().notEmpty(),
        shape({
          name: string().notEmpty(),
          weight: number(),
        }),
      ],
      '',
    ),
  ),
  category: string(),
  path: string()
    .notEmpty()
    .required()
    .match(COMMAND_FORMAT),
  usage: union([string(), array(string())], []),
};

// ARGS

export const argBlueprint: Blueprint<Arg<unknown>> = {
  ...commonBlueprint,
  default: union([bool(), number(), string()], ''),
  type: string<'string'>('string').required(),
  validate: func(),
};

// OPTIONS

export const optionBlueprint: Blueprint<Option<any>> = {
  ...argBlueprint,
  category: string(),
  short: string<ShortOptionName>().match(/^[a-z]$/giu),
};

export const flagBlueprint: Blueprint<Flag> = {
  ...optionBlueprint,
  default: bool(DEFAULT_BOOLEAN_VALUE),
  type: string().oneOf(['boolean']),
};

export const stringOptionBlueprint: Blueprint<SingleOption<string>> = {
  ...optionBlueprint,
  choices: array(string()),
  count: bool().never(),
  default: string(DEFAULT_STRING_VALUE),
  type: string().oneOf(['string']),
};

export const stringsOptionBlueprint: Blueprint<MultipleOption<string[]>> = {
  ...optionBlueprint,
  arity: number(),
  default: array(string(), []),
  multiple: bool().onlyTrue(),
  type: string().oneOf(['string']),
};

export const numberOptionBlueprint: Blueprint<SingleOption<number>> = {
  ...optionBlueprint,
  choices: array(number()),
  count: bool().onlyTrue(),
  default: number(DEFAULT_NUMBER_VALUE),
  type: string().oneOf(['number']),
};

export const numbersOptionBlueprint: Blueprint<MultipleOption<number[]>> = {
  ...optionBlueprint,
  arity: number(),
  default: array(number(), []),
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
