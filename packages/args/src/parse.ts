/* eslint-disable no-continue */

import {
  Arguments,
  Argv,
  ArgList,
  ArgumentOptions,
  ArgumentPositionals,
  Scope,
  OptionConfig,
  Mapping,
  ValueMap,
  ShortOptionName,
} from './types';
import { checkAliasExists } from './validate';
import getDefaultValue from './helpers/getDefaultValue';
import isFlagGroup from './helpers/isFlagGroup';
import isShortOption from './helpers/isShortOption';
import isLongOption from './helpers/isLongOption';
import expandFlagGroup from './helpers/expandFlagGroup';
import expandShortOption from './helpers/expandShortOption';
import createScope from './helpers/createScope';
import isOptionLike from './helpers/isOptionLike';
import updateScopeValue from './helpers/updateScopeValue';
import castValue from './helpers/castValue';
import ParseError from './ParseError';

// TERMINOLOGY
// arg - All types of arguments passed on the command line, separated by a space.
// option - An optional argument that requires a value(s). Starts with "--" (long) or "-" (short).
// flag - A specialized option that only supports booleans. Can be toggled on an off (default).
// positional arg - An optional or required argument, that is not an option or option value,
//    supports any raw value, and enforces a defined order.
// rest arg - All remaining arguments that appear after a stand alone "--".
//    Usually passed to subsequent scripts.
// scope - Argument currently being parsed.

// FEATURES
// Short name - A short name (single character) for an existing option or flag: --verbose -v
// Flag grouping - When multiple short flags are passed under a single option: -abc
// Inline values - Option values that are immediately set using an equals sign: --foo=bar
// Arity count - Required number of argument values to consume for option multiples.
// Choices - List of valid values to choose from. Errors otherwise.

// TODO
// Globals / categories
// Positionals
// Validate option?

export default function parse<T extends object = {}>(
  argv: Argv,
  optionConfigs: ArgumentOptions<T>,
  positionalConfigs: ArgumentPositionals = [],
): Arguments<T> {
  const errors: Error[] = [];
  const options: ValueMap = {};
  const positionals: ArgList = [];
  const rest: ArgList = [];
  const mapping: Mapping = {};
  let currentScope: Scope | null = null;

  function logError(condition: boolean, message: string, arg?: string) {
    if (condition) {
      errors.push(new ParseError(message, arg));
    }
  }

  function commitScope() {
    if (!currentScope) {
      return;
    }

    // Set and cast value if defined
    if (currentScope.value !== undefined) {
      options[currentScope.name] = castValue(currentScope.value, currentScope.config.type);
    }

    currentScope = null;
  }

  function captureValue(value: string) {
    if (!currentScope) {
      return;
    }

    // Update the scope with this new value
    updateScopeValue(currentScope, value);

    // Commit scope after a value is found (must be last)
    const { config } = currentScope;

    if (
      !config.multiple ||
      (config.arity &&
        Array.isArray(currentScope.value) &&
        currentScope.value.length >= config.arity)
    ) {
      commitScope();
    }
  }

  // Map default values and short names
  Object.keys(optionConfigs).forEach(key => {
    const config: OptionConfig = optionConfigs[key as keyof T];
    const { short } = config;

    if (short) {
      checkAliasExists(short, mapping);
      mapping[short] = key;
    }

    options[key] = getDefaultValue(config);
  });

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

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

      // Flag group "-frl"
      if (isFlagGroup(optionName)) {
        // TODO error if inline value set

        expandFlagGroup(optionName.slice(1), mapping).forEach(flagName => {
          // TODO verfiy options are actually flags
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
        logError(true, 'Unknown argument or option.', arg);

        continue;
      }

      // Parse and create next scope
      const scope = createScope(optionName, optionConfigs, options);

      // Flag found, so set value immediately and discard scope
      if (scope.flag) {
        // TODO error if inline value set

        options[scope.name] = !scope.negated;

        // Otherwise keep scope open, to capture next value
      } else {
        currentScope = scope;

        // Update scope value if an inline value exists
        if (inlineValue !== undefined) {
          captureValue(inlineValue);
        }
      }

      // Option values
    } else if (currentScope) {
      captureValue(arg);

      // Positionals
    } else {
      positionals.push(arg);
    }
  }

  // Commit final scope
  commitScope();

  // Final checks
  Object.keys(optionConfigs).forEach(key => {
    const config: OptionConfig = optionConfigs[key as keyof T];
    const value = options[key];

    logError(
      !!config.arity && Array.isArray(value) && value.length > 0 && value.length < config.arity,
      `Not enough arity arguments. Require ${config.arity}, found ${(value as unknown[]).length}.`,
      `--${key}`,
    );
  });

  return {
    errors,
    options: options as T,
    positionals,
    rest,
  };
}
