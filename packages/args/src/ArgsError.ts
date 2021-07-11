import { createScopedError } from '@boost/internal';

const errors = {
	COMMAND_INVALID_FORMAT: 'Invalid "{0}" command format. Must be letters, numbers, and dashes.',
	COMMAND_NOT_FIRST: 'Command must be passed as the first non-option, non-param argument.',
	COMMAND_PROVIDED: 'Command has already been provided as "{0}", received another "{1}".',
	CONTEXT_REQUIRED: 'Contextual parser options were not provided.',
	GROUP_REQUIRED_COUNT:
		'Numeric options must have `count` enabled when passed in a short option group.',
	GROUP_UNSUPPORTED_TYPE:
		'Only boolean and countable number options may be used in a short option group.',
	OPTION_INVALID_COUNT_TYPE: 'Only numeric options may use the `count` setting.',
	OPTION_UNKNOWN: 'Unknown option "{0}" found.',
	OPTION_UNKNOWN_FORMAT: 'Unknown option format.',
	OPTION_UNKNOWN_MORE: 'Unknown option "{0}" found. Did you mean "{1}"?',
	PARAM_INVALID_ORDER:
		'Optional param(s) {0} found before required param "{1}". Required must be first.',
	PARAM_REQUIRED: 'Param "{0}" is required but value is undefined.',
	PARAM_REQUIRED_NO_DEFAULT: 'Required param "{0}" has a default value, which is not allowed.',
	PARAM_UNKNOWN: 'Unknown param "{0}" found. Variadic params are not supported.',
	SHORT_DEFINED: 'Short option "{0}" has already been defined for "{1}".',
	SHORT_INVALID_CHAR: 'Short option "{0}" may only be a single letter.',
	SHORT_UNKNOWN: 'Unknown short option "{0}". No associated long option found.',
	VALUE_INVALID_ARITY: 'Not enough arity arguments. Require {0}, found {1}.',
	VALUE_INVALID_CHOICE: 'Invalid value, must be one of {0}, found {1}.',
	VALUE_INVALID_FORMAT: 'Value was formatted to an invalid type. Expected {0}, found {1}.',
	VALUE_NO_INLINE: 'Flags and short option groups may not use inline values.',
	VALUE_NON_ARRAY:
		'Option "{0}" is enabled for multiple values, but non-array default value found.',
	VALUE_NON_BOOL: 'Option "{0}" is set to boolean, but non-boolean default value found.',
	VALUE_NON_NUMBER: 'Option "{0}" is set to number, but non-number default value found.',
	VALUE_NON_STRING: 'Option "{0}" is set to string, but non-string default value found.',
};

export type ArgsErrorCode = keyof typeof errors;

export const ArgsError = createScopedError<ArgsErrorCode>('ARG', 'ArgsError', errors);
