/* eslint-disable complexity, no-continue */

import { ArgsError } from './ArgsError';
import { Checker } from './Checker';
import { DEFAULT_STRING_VALUE } from './constants';
import { debug } from './debug';
import { castValue } from './helpers/castValue';
import { createScope } from './helpers/createScope';
import { expandShortOption } from './helpers/expandShortOption';
import { formatValue } from './helpers/formatValue';
import { getDefaultValue } from './helpers/getDefaultValue';
import { isCommand } from './helpers/isCommand';
import { isLongOption } from './helpers/isLongOption';
import { isOptionLike } from './helpers/isOptionLike';
import { isShortOption } from './helpers/isShortOption';
import { isShortOptionGroup } from './helpers/isShortOptionGroup';
import { mapParserOptions } from './helpers/mapParserOptions';
import { processShortOptionGroup } from './helpers/processShortOptionGroup';
import { Scope } from './Scope';
import {
	AliasMap,
	ArgList,
	Arguments,
	Argv,
	MapParamType,
	OptionMap,
	ParamConfig,
	ParserOptions,
	PrimitiveType,
	ShortOptionName,
	UnknownOptionMap,
} from './types';

// TERMINOLOGY
// command line - The entire line that encompasses the following parts.
// arg - Each type of argument (or part) passed on the command line, separated by a space.
// command - An optional "command" being ran that allows for branching functionality.
//    Sub-commands are separated with ":".
// option - An optional argument that requires a value(s). Starts with "--" (long) or "-" (short).
// flag - A specialized option that only supports booleans. Can be toggled on an off (default).
// param - An optional or required argument, that is not an option or option value,
//    Supports any raw value, and enforces a defined order.
// rest - All remaining arguments that appear after a stand alone "--".
//    Usually passed to subsequent scripts.
// scope - Argument currently being parsed.

// FEATURES
// Short name - A short name (single character) for an existing option or flag: --verbose, -v
// Option grouping - When multiple short options are passed under a single option: -abc
// Inline values - Option values that are immediately set using an equals sign: --foo=bar
// Group count - Increment a number each time a short option is found in a group: -vvv
// Arity count - Required number of argument values to consume for multiples.
// Choices - List of valid values to choose from. Errors otherwise.

/**
 * Parse a list of command line arguments (typically from `process.argv`) into an arguments
 * object. Will extract commands, options, flags, and params based on the defined parser options.
 */
export function parse<O extends object = {}, P extends PrimitiveType[] = ArgList>(
	argv: Argv,
	parserOptions: ParserOptions<O, P>,
): Arguments<O, P> {
	const {
		commands: commandConfigs = [],
		loose: looseMode = false,
		options: optionConfigs,
		params: paramConfigs = [],
		unknown: allowUnknown = false,
		variadic: allowVariadic = true,
	} = parserOptions;
	const checker = new Checker(optionConfigs);
	const options: OptionMap = {};
	const params: PrimitiveType[] = [];
	const rest: ArgList = [];
	const unknown: UnknownOptionMap = {};
	const mapping: AliasMap = {};
	let command = '';
	let currentScope: Scope | null = null;

	debug('Parsing arguments: %s', argv.join(' '));

	function commitScope() {
		if (!currentScope) {
			return;
		}

		const { name, value, finalValue } = currentScope;

		// Support loose mode
		if (looseMode) {
			options[name] = value === undefined ? !currentScope.negated : finalValue;

			// Set an unknown value
		} else if (currentScope.unknown) {
			if (allowUnknown) {
				unknown[name] = value === undefined ? DEFAULT_STRING_VALUE : String(finalValue);
			}

			// Set and cast value if defined
		} else if (value !== undefined) {
			options[name] = finalValue;
		}

		currentScope = null;
	}

	// Run validations and map defaults
	checker.validateParamOrder(paramConfigs);

	mapParserOptions(parserOptions, options, params, {
		onCommand(cmd) {
			checker.validateCommandFormat(cmd);
		},
		onOption(config, value, name) {
			const { short } = config;

			if (short) {
				checker.validateUniqueShortName(name, short, mapping);
				mapping[short] = name;
			}

			options[name] = getDefaultValue(config);

			checker.validateDefaultValue(name, options[name], config);
			checker.validateNumberCount(name, config);
		},
		onParam(config) {
			checker.validateRequiredParamNoDefault(config);
		},
	});

	// Process each argument
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];

		checker.arg = arg;
		checker.argIndex = i;

		// Rest arguments found, extract remaining and exit
		if (arg === '--') {
			rest.push(...argv.slice(i + 1));
			break;
		}

		try {
			// Options
			if (isOptionLike(arg)) {
				let optionName = arg;
				let inlineValue;

				// Commit previous scope
				commitScope();

				// Extract option and inline value
				if (optionName.includes('=')) {
					[optionName, inlineValue] = optionName.split('=', 2);
				}

				// Short option group "-frl"
				if (isShortOptionGroup(optionName)) {
					checker.checkNoInlineValue(inlineValue);

					processShortOptionGroup(optionName.slice(1), optionConfigs, options, mapping, looseMode);

					continue;

					// Short option "-f"
				} else if (isShortOption(optionName)) {
					optionName = expandShortOption(
						optionName.slice(1) as ShortOptionName,
						mapping,
						looseMode,
					);

					// Long option "--foo"
				} else if (isLongOption(optionName)) {
					optionName = optionName.slice(2);
				}

				// Parse and create next scope
				const scope = createScope(optionName, optionConfigs, options);

				// Unknown option found, handle accordingly
				if (scope.unknown && !allowUnknown && !looseMode) {
					checker.checkUnknownOption(arg);

					// Flag found, so set value immediately and discard scope
				} else if (scope.flag) {
					options[scope.name] = !scope.negated;

					checker.checkNoInlineValue(inlineValue);

					// Otherwise keep scope open, to capture next value
				} else {
					currentScope = scope;

					// Update scope value if an inline value exists
					if (inlineValue !== undefined) {
						currentScope.captureValue(inlineValue, commitScope);
					}
				}

				// Option values
			} else if (currentScope) {
				currentScope.captureValue(arg, commitScope);

				// Commands
			} else if (isCommand(arg, commandConfigs)) {
				checker.checkCommandOrder(arg, command, params.length);

				if (!command) {
					command = arg;
				}

				// Params
			} else if (paramConfigs[params.length]) {
				const config = paramConfigs[params.length] as ParamConfig;

				params.push(formatValue(castValue(arg, config.type), config.format) as PrimitiveType);
			} else if (allowVariadic) {
				params.push(arg);
			} else {
				throw new ArgsError('PARAM_UNKNOWN', [arg]);
			}
		} catch (error: unknown) {
			currentScope = null;
			checker.logFailure((error as Error).message);

			continue;
		}
	}

	// Commit final scope
	commitScope();

	// Fill missing params
	for (let i = params.length; i < paramConfigs.length; i += 1) {
		const config = paramConfigs[i];

		if (config.required) {
			break;
		}

		params.push(getDefaultValue(config) as PrimitiveType);
	}

	// Run final checks
	mapParserOptions(parserOptions, options, params, {
		onOption(config, value, name) {
			checker.validateParsedOption(name, config, value);
			checker.validateArityIsMet(name, config, value);
			checker.validateChoiceIsMet(name, config, value);

			// Since default values avoid scope,
			// they are not cast. Do it manually after parsing.
			if (value === getDefaultValue(config)) {
				options[name] = castValue(value, config.type, config.multiple);
			}
		},
		onParam(config, value) {
			checker.validateParsedParam(config, value);
		},
	});

	return {
		command: command === '' ? [] : command.split(':'),
		errors: [...checker.parseErrors, ...checker.validationErrors],
		options: options as O,
		params: params as MapParamType<P>,
		rest,
		unknown,
	};
}
