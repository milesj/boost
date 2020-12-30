import { Flag, MultipleOption, SingleOption } from '../../src';

export const optConfig: SingleOption<string> = {
  description: '',
  type: 'string',
};

export const optConfigExpanded: SingleOption<string> = {
  default: 'foobar',
  description: '',
  short: 'O',
  type: 'string',
};

export const optsConfig: MultipleOption<string[]> = {
  default: [],
  description: '',
  multiple: true,
  type: 'string',
};

export const optsConfigExpanded: MultipleOption<string[]> = {
  default: ['qux'],
  description: '',
  multiple: true,
  short: 's',
  type: 'string',
};

export const optsConfigArity: MultipleOption<string[]> = {
  arity: 2,
  default: [],
  description: '',
  multiple: true,
  short: 's',
  type: 'string',
};

export const numConfig: SingleOption<number> = {
  description: '',
  type: 'number',
};

export const numConfigExpanded: SingleOption<number> = {
  default: 123,
  description: '',
  short: 'n',
  type: 'number',
};

export const numsConfig: MultipleOption<number[]> = {
  description: '',
  multiple: true,
  type: 'number',
};

export const flagConfig: Flag = {
  default: false,
  description: '',
  short: 'F',
  type: 'boolean',
};

// For strings
export const SPECIAL_CHARS = [
  // empty string
  '',
  // space
  ' ',
  // dash (not to confuse with an option)
  '-',
  // underscore
  '_',
  // newline
  '\n',
  // tab
  '\t',
];

// For numbers
export const SPECIAL_NUMBERS = [
  // zero
  '0',
  // float zero
  '0.0',
  // negative
  '-123',
  // float
  '12.45',
  // negative float
  '-12.45',
];
