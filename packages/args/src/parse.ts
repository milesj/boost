/* eslint-disable complexity, no-restricted-syntax */

import {
  Arguments,
  Argv,
  ArgList,
  ArgumentOptions,
  ArgumentPositionals,
  Scope,
  AliasMap,
  OptionConfig,
} from './types';
import {
  castValue,
  createScopeFromOption,
  expandAliasOption,
  getDefaultValue,
  isAliasOption,
  isFlagGroup,
  isOption,
  expandFlagGroup,
} from './helpers';
import { checkAliasExists } from './validate';

// TERMINOLOGY
// arg - All types of arguments passed on the command line, separated by a space.
// option - An optional argument that requires a value(s). Starts with "--" or "-" (short alias).
// flag - A specialized option that only supports booleans. Can be toggled on an off (default).
// positional arg - An optional or required argument, that is not an option or option value,
//    supports any raw value, and enforces a defined order.
// rest arg - All remaining arguments that appear after a stand alone "--".
//    Usually passed to subsequent scripts.
// scope - Argument currently being parsed.

// FEATURES
// Alias - A short alias (single character) for an existing option or flag: --verbose -v
// Flag grouping - When multiple aliases are passed under a single alias flag: -abc
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
  const options: Partial<T> = {};
  const positionals: ArgList = [];
  const rest: ArgList = [];
  const aliases: AliasMap = {};
  let currentScope: Scope | null = null;

  function commitScope() {
    if (currentScope) {
      options[currentScope.name] = currentScope.value;
      currentScope = null;
    }
  }

  // Map values and aliases
  Object.keys(optionConfigs).forEach(key => {
    const config: OptionConfig = optionConfigs[key];
    const { alias } = config;

    if (alias) {
      checkAliasExists(alias, aliases);
      aliases[alias] = key;
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
        expandFlagGroup(optionName.slice(1), aliases).forEach(flagName => {
          options[flagName] = true;
        });

        // Skip to next argument
        // eslint-disable-next-line no-continue
        continue;

        // Short option "-f" (aliased option)
      } else if (isAliasOption(optionName)) {
        optionName = expandAliasOption(optionName.slice(1), aliases);

        // Long option "--foo" (option)
      } else if (isOption(optionName)) {
        optionName = optionName.slice(2);

        // Unknown format
      } else {
        throw new Error('Unknown option.');
      }

      // Parse next scope
      const scope = createScopeFromOption(optionName, inlineValue, optionConfigs, options);

      // Flag found, so set value immediately and discard scope
      if (scope.flag) {
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
    aliases,
    options: options as T,
    positionals,
    rest,
  };
}
