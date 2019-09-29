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
  MapPositionalType,
  PositionalConfig,
} from './types';
import getDefaultValue from './helpers/getDefaultValue';
import isFlagGroup from './helpers/isFlagGroup';
import isShortOption from './helpers/isShortOption';
import isLongOption from './helpers/isLongOption';
import expandFlagGroup from './helpers/expandFlagGroup';
import expandShortOption from './helpers/expandShortOption';
import createScope from './helpers/createScope';
import isOptionLike from './helpers/isOptionLike';
import mapParserOptions from './helpers/mapParserOptions';
import isCommand from './helpers/isCommand';
import Checker from './Checker';
import Scope from './Scope';
import castValue from './helpers/castValue';

// TERMINOLOGY
// arg - All types of arguments passed on the command line, separated by a space.
// command - An optional "command" being ran that allows for branching functionality.
//    Supports alnum chars and underscores. Sub-commands are separated with ":".
// option - An optional argument that requires a value(s). Starts with "--" (long) or "-" (short).
// flag - A specialized option that only supports booleans. Can be toggled on an off (default).
// positional arg - An optional or required argument, that is not an option or option value,
//    Supports any raw value, and enforces a defined order.
// rest arg - All remaining arguments that appear after a stand alone "--".
//    Usually passed to subsequent scripts.
// scope - Argument currently being parsed.

// FEATURES
// Short name - A short name (single character) for an existing option or flag: --verbose, -v
// Flag grouping - When multiple short flags are passed under a single option: -abc
// Inline values - Option values that are immediately set using an equals sign: --foo=bar
// Arity count - Required number of argument values to consume for option multiples.
// Choices - List of valid values to choose from. Errors otherwise.

export default function parse<O extends object = {}, P extends unknown[] = ArgList>(
  argv: Argv,
  parserOptions: ParserOptions<O, P>,
): Arguments<O, P> {
  const {
    commands: commandConfigs = [],
    options: optionConfigs,
    positionals: positionalConfigs = [],
  } = parserOptions;
  const checker = new Checker();
  const options: OptionMap = {};
  const positionals: PrimitiveType[] = [];
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
  checker.validatePositionalOrder(positionalConfigs);

  mapParserOptions(parserOptions, options, positionals, {
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

      try {
        // Flag group "-frl"
        if (isFlagGroup(optionName)) {
          checker.checkFlagHasNoInlineValue(inlineValue);

          expandFlagGroup(optionName.slice(1), mapping).forEach(flagName => {
            checker.checkFlagGroupIsBoolOption(flagName, optionConfigs);
            options[flagName] = true;
          });

          continue;

          // Short option "-f"
        } else if (isShortOption(optionName)) {
          optionName = expandShortOption(optionName.slice(1) as ShortOptionName, mapping);

          // Long option "--foo"
        } else if (isLongOption(optionName)) {
          optionName = optionName.slice(2);

          // Unknown option format
        } else {
          throw new Error('Unknown option format.');
        }
      } catch (error) {
        checker.logFailure(error.message);

        continue;
      }

      // Parse and create next scope
      const scope = createScope(optionName, optionConfigs, options);

      // Flag found, so set value immediately and discard scope
      if (scope.flag) {
        options[scope.name] = !scope.negated;

        checker.checkFlagHasNoInlineValue(inlineValue);

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
      checker.checkCommandOrder(arg, command, positionals.length);

      if (!command) {
        command = arg;
      }

      // Positionals
    } else if (positionalConfigs[positionals.length]) {
      const config = positionalConfigs[positionals.length] as PositionalConfig;

      positionals.push(castValue(arg, config.type) as PrimitiveType);
    } else {
      positionals.push(arg);
    }
  }

  // Commit final scope
  commitScope();

  // Run final checks
  mapParserOptions(parserOptions, options, positionals, {
    onOption(config, value, name) {
      checker.validateParsedOption(name, config, value);
      checker.validateArityIsMet(name, config, value);
      checker.validateChoiceIsMet(name, config, value);
    },
    onPositional(config, value) {
      checker.validateParsedPositional(config, value);
    },
  });

  return {
    command: command === '' ? [] : command.split(':'),
    errors: [...checker.parseErrors, ...checker.validationErrors],
    options: options as O,
    positionals: positionals as MapPositionalType<P>,
    rest,
  };
}
