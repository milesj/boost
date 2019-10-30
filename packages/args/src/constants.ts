import path from 'path';
import { createInternalDebugger } from '@boost/internal';
import { createTranslator } from '@boost/translate';

export const debug = createInternalDebugger('args');

// Supports letters, numbers, dashes, and camel case.
// Minimum 2 characters. Must start and end with a letter.
export const COMMAND_FORMAT = /^[a-z][-a-z0-9]*[a-z]$/iu;

// Double dash followed by a long name.
// Supports letters, numbers, dashes, and camel case.
// Minimum 2 characters. Must start with a letter.
export const LONG_OPTION_FORMAT = /^--[a-z][-a-z0-9]+$/iu;

// Single dash followed by a short name.
// Exactly 1 character.
export const SHORT_OPTION_FORMAT = /^-[a-z]{1}$/iu;

// Single dash followed by N short names.
// Minimum 2 characters, otherwise its a single short option.
export const SHORT_OPTION_GROUP_FORMAT = /^-[a-z]{2,}$/iu;

// Pattern to match all the above, with the addition
// of an inline value check.
export const OPTION_LIKE = /^-{1,2}[a-z][-a-z0-9]*=?/iu;
