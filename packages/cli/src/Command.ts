import 'reflect-metadata';
import {
  ArgList,
  MapOptionConfig,
  OptionConfig,
  PrimitiveType,
  MapParamConfig,
  ParserOptions,
  COMMAND_FORMAT,
} from '@boost/args';
import { RuntimeError } from '@boost/internal';
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
   * Return and validate all metadata registered to this instance.
   */
  getMetadata(): CommandMetadata {
    const ctor = (this.constructor as unknown) as CommandConstructorMetadata;
    const metadata: CommandMetadata = {
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      usage: ctor.usage,
      ...Reflect.getMetadata(META_CONFIG, ctor),
      commands: Reflect.getMetadata(META_COMMANDS, this) || {},
      options: Reflect.getMetadata(META_OPTIONS, this) || {},
      params: Reflect.getMetadata(META_PARAMS, this) || [],
      path: this.getPath(),
      rest: Reflect.getMetadata(META_REST, this),
    };

    // VALIDATE

    if (!metadata.path || typeof metadata.path !== 'string') {
      throw new Error(
        'Command registered without a canonical path. Have you decorated your command?',
      );
    } else if (!metadata.path.match(COMMAND_FORMAT)) {
      throw new RuntimeError('args', 'AG_COMMAND_INVALID_FORMAT', [name]);
    }

    return metadata;
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
    const path =
      Reflect.getMetadata(META_PATH, this.constructor) ||
      ((this.constructor as unknown) as CommandConstructorMetadata).path ||
      '';

    if (!path || typeof path !== 'string') {
      throw new Error(
        'Command registered without a canonical path. Have you described the command?',
      );
    } else if (!path.match(COMMAND_FORMAT)) {
      throw new RuntimeError('args', 'AG_COMMAND_INVALID_FORMAT', [path]);
    }

    return path;
  }

  /**
   * Register a sub-command for the current command.
   */
  protected registerCommand(command: Commandable): this {
    const path = this.getPath();
    const subPath = command.getPath();

    if (!subPath.startsWith(path)) {
      throw new Error(`Sub-command "${subPath}" must be prefixed with "${path}:".`);
    }

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
