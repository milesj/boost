/* eslint-disable unicorn/no-unsafe-regex */

import { ExitCode } from './types';

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
export const VERSION_FORMAT =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u;
export const LOCALE_FORMAT = /^[a-z]{2}(-[A-Z]{2})?$/u;

export const EXIT_PASS: ExitCode = 0;
export const EXIT_FAIL: ExitCode = 1;

export const INTERNAL_OPTIONS = Symbol('options');
export const INTERNAL_PARAMS = Symbol('params');
export const INTERNAL_PROGRAM = Symbol('program');
export const INTERNAL_INITIALIZER = Symbol('initializer');

export const RESERVED_OPTIONS = [
	// Existing args
	'help',
	'locale',
	'rest',
	'unknown',
	'version',
	// Class methods
	'exit',
	'log',
	'register',
	'run',
	// Class properties
	'commands',
	'commandAliases',
];

export const SPACING_COL = 1;
export const SPACING_COL_WIDE = 2;
export const SPACING_ROW = 1;

export const DELIMITER = '$ ';
