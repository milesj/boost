/* eslint-disable complexity, no-restricted-syntax */

import path from 'path';
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
  isOption,
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
// ? - Alias - A short alias (single character) for an existing option or flag: --verbose -v
// ? - Dot options - Options with a dot in their name will expand to an object: --foo.bar
// ? - Flag grouping - When multiple aliases are passed under a single flag: -abc
// ? - Inline values - Option values that are immediately set using an equals sign: --foo=bar

export default function parse<T extends object = {}>(
  argv: Argv,
  optionConfigs: ArgumentOptions<T>,
  positionalConfigs?: ArgumentPositionals,
): Arguments<T> {
  const args: Partial<T> = {};
  const command = path.basename(argv[1]);
  const positionals: ArgList = [];
  const rest: ArgList = [];
  const aliases: AliasMap = {};
  let currentScope: Scope | null = null;

  function commitScope() {
    if (currentScope) {
      args[currentScope.name] = currentScope.value;
      currentScope = null;
    }
  }

  // Map option values and aliases
  Object.keys(optionConfigs).forEach(key => {
    const config: OptionConfig = optionConfigs[key];
    const { alias } = config;

    if (alias) {
      checkAliasExists(alias, aliases);
      aliases[alias] = key;
    }

    args[key] = getDefaultValue(config);
  });

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    // Rest arguments found, extract remaining and exit
    if (arg === '--') {
      rest.push(...argv.slice(i, argv.length));
      break;
    }

    // Options
    if (isOption(arg)) {
      let optionName = '';

      // Commit previous scope
      commitScope();

      // Expand alias to full option
      if (isAliasOption(arg)) {
        optionName = expandAliasOption(arg.slice(1), aliases);
      } else {
        optionName = arg.slice(2);
      }

      // Parse next scope
      const scope = createScopeFromOption(optionName, optionConfigs, args);

      // Flag found, so set value immediately and discard scope
      if (scope.flag) {
        args[scope.name] = !scope.negated;

        // Otherwise keep scope open, to capture next value
      } else {
        currentScope = scope;
      }

      // Option values
    } else if (currentScope) {
      const config: OptionConfig = optionConfigs[currentScope.name];

      if (Array.isArray(currentScope.value)) {
        currentScope.value.push(castValue(arg, config.type));
      } else {
        currentScope.value = castValue(arg, config.type);
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
    args,
    argv,
    command,
    positionals,
    rest,
  };
}
