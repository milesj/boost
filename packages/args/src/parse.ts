/* eslint-disable complexity, no-continue */

import {
  Arguments,
  Argv,
  ArgList,
  AliasMap,
  OptionMap,
  ShortOptionName,
  ParserOptions,
  PrimitiveType,
  MapParamType,
  ParamConfig,
} from './types';
import getDefaultValue from './helpers/getDefaultValue';
import isShortOption from './helpers/isShortOption';
import isShortOptionGroup from './helpers/isShortOptionGroup';
import isLongOption from './helpers/isLongOption';
import expandShortOption from './helpers/expandShortOption';
import createScope from './helpers/createScope';
import isOptionLike from './helpers/isOptionLike';
import mapParserOptions from './helpers/mapParserOptions';
import isCommand from './helpers/isCommand';
import castValue from './helpers/castValue';
import processShortOptionGroup from './helpers/processShortOptionGroup';
import Checker from './Checker';
import Scope from './Scope';

// TERMINOLOGY
// arg - All types of arguments passed on the command line, separated by a space.
// command - An optional "command" being ran that allows for branching functionality.
//    Sub-commands are separated with ":".
// option - An optional argument that requires a value(s). Starts with "--" (long) or "-" (short).
// flag - A specialized option that only supports booleans. Can be toggled on an off (default).
// param - An optional or required argument, that is not an option or option value,
//    Supports any raw value, and enforces a defined order.
// rest arg - All remaining arguments that appear after a stand alone "--".
//    Usually passed to subsequent scripts.
// scope - Argument currently being parsed.

// FEATURES
// Short name - A short name (single character) for an existing option or flag: --verbose, -v
// Option grouping - When multiple short options are passed under a single option: -abc
// Inline values - Option values that are immediately set using an equals sign: --foo=bar
// Group count - Increment a number each time a short option is found in a group: -vvv
// Arity count - Required number of argument values to consume for multiples.
// Choices - List of valid values to choose from. Errors otherwise.

export default function parse<O extends object = {}, P extends PrimitiveType[] = ArgList>(
  argv: Argv,
  parserOptions: ParserOptions<O, P>,
): Arguments<O, P> {
  const {
    commands: commandConfigs = [],
    options: optionConfigs,
    params: paramConfigs = [],
  } = parserOptions;
  const checker = new Checker();
  const options: OptionMap = {};
  const params: PrimitiveType[] = [];
  const rest: ArgList = [];
  const mapping: AliasMap = {};
  let command = '';
  let currentScope: Scope | null = null;

  function commitScope() {
    if (!currentScope) {
      return;
    }

    // Set and cast value if defined
    if (currentScope.value !== undefined) {
      options[currentScope.name] = currentScope.finalValue;
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

          processShortOptionGroup(optionName.slice(1), optionConfigs, options, mapping);

          continue;

          // Short option "-f"
        } else if (isShortOption(optionName)) {
          optionName = expandShortOption(optionName.slice(1) as ShortOptionName, mapping);

          // Long option "--foo"
        } else if (isLongOption(optionName)) {
          optionName = optionName.slice(2);
        }

        // Parse and create next scope
        const scope = createScope(optionName, optionConfigs, options);

        // Flag found, so set value immediately and discard scope
        if (scope.flag) {
          options[scope.name] = !scope.negated;

          checker.checkNoInlineValue(inlineValue);

          // Otherwise keep scope open, to capture next value
        } else {
          currentScope = scope;

          // Update scope value if an inline value exists
          if (inlineValue !== undefined) {
            currentScope.captureValue(inlineValue, commitScope);

            // Increment count when using long form
          } else if (scope.config.count) {
            currentScope.captureValue('1', commitScope);
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

        params.push(castValue(arg, config.type) as PrimitiveType);
      } else {
        params.push(arg);
      }
    } catch (error) {
      checker.logFailure(error.message);

      continue;
    }
  }

  // Commit final scope
  commitScope();

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
  };
}
