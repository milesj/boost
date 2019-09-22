/* eslint-disable complexity, no-restricted-syntax */

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
import castValue from './helpers/castValue';

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
// ? - Nargs count - Maximum count of argument values to consume for option multiples.
// Choices - List of valid values to choose from. Errors otherwise.

// TODO
// Globals

export default function parse<T extends object = {}>(
  argv: Argv,
  optionConfigs: ArgumentOptions<T>,
  positionalConfigs: ArgumentPositionals = [],
): Arguments<T> {
  const options: ValueMap = {};
  const positionals: ArgList = [];
  const rest: ArgList = [];
  const mapping: Mapping = {};
  let currentScope: Scope | null = null;

  function commitScope() {
    if (currentScope) {
      options[currentScope.name] = currentScope.value;
      currentScope = null;
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

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    // Rest arguments found, extract remaining and exit
    if (arg === '--') {
      rest.push(...argv.slice(i + 1));
      break;
    }

    // Options
    if (arg.charAt(0) === '-') {
      let optionName = arg;
      let inlineValue = '';

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

        // Skip to next argument
        // eslint-disable-next-line no-continue
        continue;

        // Short option "-f"
      } else if (isShortOption(optionName)) {
        optionName = expandShortOption(optionName.slice(1) as ShortOptionName, mapping);

        // Long option "--foo"
      } else if (isLongOption(optionName)) {
        optionName = optionName.slice(2);

        // Unknown format
      } else {
        throw new Error('Unknown option.');
      }

      // Parse next scope
      const scope = createScope(optionName, inlineValue, optionConfigs, options);

      // Flag found, so set value immediately and discard scope
      if (scope.flag) {
        // TODO error if inline value set

        options[scope.name] = !scope.negated;

        // Otherwise keep scope open, to capture next value
      } else {
        currentScope = scope;
      }

      // Option values
    } else if (currentScope) {
      const { config, name } = currentScope;
      const value = castValue(arg, config.type);

      // Multiple values
      if (Array.isArray(currentScope.value)) {
        (currentScope.value as unknown[]).push(value);

        // Single value
      } else {
        // Verify value against a list of choices
        if (Array.isArray(config.choices) && !config.choices.includes(value)) {
          throw new Error(
            `Invalid --${name} value, must be one of ${config.choices.join(', ')}, found ${value}.`,
          );
        }

        currentScope.value = value;

        // Stop capturing after a value is found (must be last)
        commitScope();
      }

      // Positionals
    } else {
      positionals.push(arg);
    }
  }

  // Commit final scope
  commitScope();

  return {
    mapping,
    options: options as T,
    positionals,
    rest,
  };
}
