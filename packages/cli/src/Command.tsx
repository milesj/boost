/* eslint-disable @typescript-eslint/consistent-type-assertions */

import React from 'react';
import {
  ArgList,
  PrimitiveType,
  ParserOptions,
  ParamConfigList,
  OptionConfigMap,
  UnknownOptionMap,
} from '@boost/args';
import { Logger } from '@boost/log';
import { RuntimeError } from '@boost/internal';
import { msg, LOCALE_FORMAT, CACHE_OPTIONS, CACHE_PARAMS } from './constants';
import {
  GlobalOptions,
  Commandable,
  CommandMetadata,
  ExitHandler,
  RunResult,
  CommandPath,
  Categories,
} from './types';
import mapCommandMetadata from './helpers/mapCommandMetadata';
import getConstructor from './metadata/getConstructor';
import getInheritedCategories from './metadata/getInheritedCategories';
import getInheritedOptions from './metadata/getInheritedOptions';
import validateParams from './metadata/validateParams';
import validateOptions from './metadata/validateOptions';
import validateConfig from './metadata/validateConfig';
import CommandManager from './CommandManager';
import Help from './Help';

export default abstract class Command<
  O extends GlobalOptions = GlobalOptions,
  P extends PrimitiveType[] = ArgList,
  Options extends object = {}
> extends CommandManager<Options> implements Commandable<O, P> {
  static aliases: string[] = [];

  static allowUnknownOptions: boolean = false;

  static categories: Categories = {};

  static category: string = '';

  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static options: OptionConfigMap = {
    help: {
      category: 'global',
      description: msg('cli:optionHelpDescription'),
      short: 'h',
      type: 'boolean',
    },
    locale: {
      category: 'global',
      default: 'en',
      description: msg('cli:optionLocaleDescription'),
      type: 'string',
      validate(value: string) {
        if (value && !value.match(LOCALE_FORMAT)) {
          throw new Error(msg('cli:errorInvalidLocale'));
        }
      },
    },
    version: {
      category: 'global',
      description: msg('cli:optionVersionDescription'),
      short: 'v',
      type: 'boolean',
    },
  };

  static params: ParamConfigList = [];

  static path: string = '';

  static showRestParams: boolean | string = false;

  static usage: string | string[] = '';

  // Args

  help: boolean = false;

  locale: string = 'en';

  rest: string[] = [];

  unknown: UnknownOptionMap = {};

  version: boolean = false;

  // Methods

  exit!: ExitHandler;

  log!: Logger;

  // Cache

  [CACHE_OPTIONS] = {};

  [CACHE_PARAMS] = {};

  constructor(options?: Options) {
    super(options);

    const ctor = getConstructor(this);

    validateConfig(this.constructor.name, {
      aliases: ctor.aliases,
      allowUnknownOptions: ctor.allowUnknownOptions,
      categories: ctor.categories,
      category: ctor.category,
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      path: ctor.path,
      showRestParams: ctor.showRestParams,
      usage: ctor.usage,
    });
    validateOptions(ctor.options);
    validateParams(ctor.params);

    this.onBeforeRegister.listen(this.handleBeforeRegister);
  }

  /**
   * Validate options passed to the constructor.
   */
  blueprint() {
    // This is technically invalid, but most commands will not be using options.
    // This is a side-effect of `CommandManager`, in which options are required for `Program`.
    return {} as any;
  }

  /**
   * Life cycle that is triggered before the command is run.
   */
  bootstrap() {}

  /**
   * Validate and return all metadata registered to this command instance.
   */
  getMetadata(): CommandMetadata {
    const ctor = getConstructor(this);

    return {
      aliases: ctor.aliases,
      allowUnknownOptions: ctor.allowUnknownOptions,
      categories: getInheritedCategories(this),
      category: ctor.category,
      commands: this.commands,
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      options: getInheritedOptions(this),
      params: ctor.params,
      path: ctor.path,
      showRestParams: ctor.showRestParams,
      usage: ctor.usage,
    };
  }

  /**
   * Return metadata as options for argument parsing.
   */
  getParserOptions(): ParserOptions<O, P> {
    const { aliases, options, params, path } = this.getMetadata();
    const defaultedOptions: OptionConfigMap = {};

    // Since default values for options are represented as class properties,
    // we need to inject the defaults into the argument parsing layer.
    // We can easily do this here and avoid a lot of headache.
    Object.entries(options).forEach(([option, config]) => {
      defaultedOptions[option] = {
        ...config,
        default: this[option as keyof this] ?? config.default,
      };
    });

    return {
      commands: [path, ...aliases],
      options: defaultedOptions,
      params,
      unknown: getConstructor(this).allowUnknownOptions,
    } as ParserOptions<O, P>;
  }

  /**
   * Return the command path (canonical name on the command line).
   */
  getPath(): string {
    return getConstructor(this).path;
  }

  /**
   * Render a help menu for the current command.
   */
  renderHelp(): React.ReactElement {
    const metadata = this.getMetadata();

    return (
      <Help
        categories={metadata.categories}
        config={metadata}
        commands={mapCommandMetadata(metadata.commands)}
        header={metadata.path}
        options={metadata.options}
        params={metadata.params}
      />
    );
  }

  /**
   * Executed when the command is being ran.
   */
  abstract run(...params: P): RunResult | Promise<RunResult>;

  /**
   * Verify sub-command is prefixed with the correct path.
   */
  private handleBeforeRegister = (subPath: CommandPath) => {
    const path = this.getPath();

    if (!subPath.startsWith(path)) {
      throw new RuntimeError('cli', 'CLI_COMMAND_INVALID_SUBPATH', [subPath, path]);
    }
  };
}
