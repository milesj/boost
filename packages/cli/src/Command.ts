import 'reflect-metadata';
import {
  ArgList,
  MapOptionConfig,
  OptionConfig,
  PrimitiveType,
  MapParamConfig,
  ParserOptions,
} from '@boost/args';
import { Arg } from './decorators';
import registerOption from './metadata/registerOption';
import registerParams from './metadata/registerParams';
import { GlobalArgumentOptions, Commandable, CommandMetadata } from './types';
import {
  msg,
  META_OPTIONS,
  META_PARAMS,
  META_COMMANDS,
  META_NAME,
  META_REST,
  META_DESCRIPTION,
} from './constants';
import registerCommand from './metadata/registerCommand';

export default abstract class Command<
  O extends GlobalArgumentOptions,
  P extends PrimitiveType[] = ArgList
> implements Commandable<P> {
  @Arg.Flag(msg('cli:optionHelpDescription'), { short: 'h' })
  help: O['help'] = false;

  @Arg.String(msg('cli:optionLocaleDescription'))
  locale: O['locale'] = 'en';

  @Arg.Rest()
  rest: string[] = [];

  @Arg.Flag(msg('cli:optionVersionDescription'), { short: 'v' })
  version: O['version'] = false;

  /**
   * Return all metadata registered to this instance.
   */
  getMetadata(): CommandMetadata {
    return {
      commands: Reflect.getMetadata(META_COMMANDS, this) || {},
      description: Reflect.getMetadata(META_DESCRIPTION, this.constructor) || '',
      name: Reflect.getMetadata(META_NAME, this.constructor) || '',
      options: Reflect.getMetadata(META_OPTIONS, this) || {},
      params: Reflect.getMetadata(META_PARAMS, this) || [],
      rest: Reflect.getMetadata(META_REST, this),
    };
  }

  /**
   * Return metadata as options for argument parsing.
   */
  getParserOptions(): ParserOptions<O, P> {
    const { name, options, params } = this.getMetadata();

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      commands: [name],
      options,
      params,
    } as ParserOptions<O, P>;
  }

  /**
   * Register a sub-command for the current command.
   */
  registerCommand(command: Commandable): this {
    registerCommand(this, command);

    return this;
  }

  /**
   * Register argument options that this command should parse and support.
   * The object keys are class properties that the option values will be set to.
   *
   * This method should only be called if not using decorators.
   */
  registerOptions(options: MapOptionConfig<O>): this {
    Object.entries(options).forEach(([option, config]) => {
      registerOption(this, option as keyof this, config as OptionConfig);
    });

    return this;
  }

  /**
   * Register argument parameters that this command should parse and support.
   * Each parameter will be a method argument passed to `execute()`.
   *
   * This method should only be called if not using decorators.
   */
  registerParams(params: MapParamConfig<P>): this {
    registerParams(this, 'execute', params);

    return this;
  }

  /**
   * Executed when the command is being ran.
   */
  abstract async execute(...params: P): Promise<void>;
}
