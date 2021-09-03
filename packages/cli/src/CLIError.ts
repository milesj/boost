import { createScopedError } from '@boost/internal';

const errors = {
	COMMAND_DEFINED: 'A command already exists with the canonical path "{0}".',
	COMMAND_INVALID_REGISTER:
		'Invalid command type being registered. Must be a command instance with a `run()` method.',
	COMMAND_INVALID_RUN: 'Failed to determine a command to run.',
	COMMAND_INVALID_SUBPATH: 'Sub-command "{0}" must start with "{1}:".',
	COMMAND_MIXED_DEFAULT:
		'A default command has been registered. Cannot mix default and non-default commands.',
	COMMAND_MIXED_NONDEFAULT:
		'Other commands have been registered. Cannot mix default and non-default commands.',
	COMMAND_NO_PROGRAM: 'No program found. Must be ran within the context of a parent program.',
	COMMAND_NONE_REGISTERED: 'No commands have been registered. At least 1 is required.',
	COMMAND_UNKNOWN: 'Unknown command "{0}". Did you mean "{1}"?',
	MIDDLEWARE_INVALID: 'Middleware must be a function.',
	OPTION_RESERVED: 'Option "{0}" is a reserved name and cannot be used.',
	PARAMS_RUN_ONLY: 'Parameters must be defined on the `run()` method.',
	REACT_RENDER_NO_NESTED:
		'A React render process already exists. Unable to render current command. This usually occurs by triggering nested program calls.',
	THEME_UNKNOWN: 'Theme could not be loaded. Attempted `@boost/theme-{0}` and `boost-theme-{0}`.',
};

export type CLIErrorCode = keyof typeof errors;

export const CLIError = createScopedError<CLIErrorCode>('CLI', 'CLIError', errors);
