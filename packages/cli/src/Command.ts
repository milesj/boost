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
import registerCommand from './metadata/registerCommand';
import registerOption from './metadata/registerOption';
import registerParams from './metadata/registerParams';
import {
  msg,
  META_OPTIONS,
  META_PARAMS,
  META_COMMANDS,
  META_REST,
  META_CONFIG,
  META_PATH,
} from './constants';
import {
  GlobalArgumentOptions,
  Commandable,
  CommandMetadata,
  CommandConstructorMetadata,
} from './types';

export default abstract class Command<
  O extends GlobalArgumentOptions,
  P extends PrimitiveType[] = ArgList
> implements Commandable<P> {
  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static path: string = '';

  static usage: string = '';

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
    const ctor = (this.constructor as unknown) as CommandConstructorMetadata;

    return {
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      usage: ctor.usage,
      ...Reflect.getMetadata(META_CONFIG, ctor),
      commands: Reflect.getMetadata(META_COMMANDS, this) || {},
      options: Reflect.getMetadata(META_OPTIONS, this) || {},
      params: Reflect.getMetadata(META_PARAMS, this) || [],
      path: Reflect.getMetadata(META_PATH, ctor) || ctor.path || '',
      rest: Reflect.getMetadata(META_REST, this),
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
   * Register a sub-command for the current command.
   */
  protected registerCommand(command: Commandable): this {
    registerCommand(this, command);

    return this;
  }

  /**
   * Register argument options that this command should parse and support.
   * The object keys are class properties that the option values will be set to.
   *
   * This method should only be called if not using decorators.
   */
  protected registerOptions(options: MapOptionConfig<O>): this {
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
  protected registerParams(params: MapParamConfig<P>): this {
    registerParams(this, 'run', params);

    return this;
  }

  /**
   * Executed when the command is being ran.
   */
  abstract async run(...params: P): Promise<void>;
}
