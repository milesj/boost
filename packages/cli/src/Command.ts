import {
  ArgList,
  PrimitiveType,
  ParserOptions,
  ParamConfigList,
  OptionConfigMap,
} from '@boost/args';
import { Logger } from '@boost/log';
import { msg } from './constants';
import {
  GlobalArgumentOptions,
  Commandable,
  CommandMetadata,
  ExitHandler,
  RunResult,
} from './types';
import getConstructor from './metadata/getConstructor';
import getInheritedOptions from './metadata/getInheritedOptions';
import validateParams from './metadata/validateParams';
import validateOptions from './metadata/validateOptions';
import validateConfig from './metadata/validateConfig';

export default abstract class Command<
  O extends GlobalArgumentOptions = GlobalArgumentOptions,
  P extends PrimitiveType[] = ArgList
> implements Commandable<P> {
  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static options: OptionConfigMap = {
    help: {
      description: msg('cli:optionHelpDescription'),
      short: 'h',
      type: 'boolean',
    },
    locale: {
      default: 'en',
      description: msg('cli:optionLocaleDescription'),
      type: 'string',
    },
    version: {
      description: msg('cli:optionVersionDescription'),
      short: 'v',
      type: 'boolean',
    },
  };

  static params: ParamConfigList = [];

  static path: string = '';

  static rest: string[] = [];

  static usage: string | string[] = '';

  help: boolean = false;

  locale: string = 'en';

  version: boolean = false;

  exit!: ExitHandler;

  log!: Logger;

  protected subCommands: CommandMetadata['commands'] = {};

  constructor() {
    const ctor = getConstructor(this);

    validateConfig(this.constructor.name, {
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      path: ctor.path,
      rest: ctor.rest,
      usage: ctor.usage,
    });
    validateOptions(ctor.options);
    validateParams(ctor.params);
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
      commands: this.subCommands,
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      options: getInheritedOptions(this),
      params: ctor.params,
      path: ctor.path,
      rest: ctor.rest,
      usage: ctor.usage,
    };
  }

  /**
   * Return metadata as options for argument parsing.
   */
  getParserOptions(): ParserOptions<O, P> {
    const { options, params, path } = this.getMetadata();

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      commands: [path],
      options,
      params,
    } as ParserOptions<O, P>;
  }

  /**
   * Return the command path (canonical name on the command line).
   */
  getPath(): string {
    return getConstructor(this).path;
  }

  /**
   * Register a sub-command for the current command.
   */
  register(command: Commandable): this {
    const path = this.getPath();
    const subPath = command.getPath();

    if (!subPath.startsWith(path)) {
      throw new Error(`Sub-command "${subPath}" must start with "${path}:".`);
    }

    if (this.subCommands[subPath] && this.subCommands[subPath] !== command) {
      throw new Error(`A command already exists with the canonical path "${subPath}".`);
    }

    this.subCommands[subPath] = command;

    return this;
  }

  /**
   * Executed when the command is being ran.
   */
  abstract async run(...params: P): Promise<RunResult>;
}
