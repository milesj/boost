import 'reflect-metadata';
import React from 'react';
import {
  ArgList,
  MapOptionConfig,
  OptionConfig,
  PrimitiveType,
  MapParamConfig,
  ParserOptions,
  COMMAND_FORMAT,
} from '@boost/args';
import { optimal } from '@boost/common';
import { RuntimeError, ExitError } from '@boost/internal';
import { Arg } from './decorators';
import registerCommand from './metadata/registerCommand';
import registerOption from './metadata/registerOption';
import registerParams from './metadata/registerParams';
import { commandMetadataBlueprint } from './metadata/blueprints';
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
  CommandStaticConfig,
  ExitCode,
} from './types';

export default abstract class Command<
  O extends GlobalArgumentOptions,
  P extends PrimitiveType[] = ArgList
> implements Commandable<P> {
  static description: string = '';

  static deprecated: boolean = false;

  static hidden: boolean = false;

  static path: string = '';

  static usage: string | string[] = '';

  @Arg.Flag(msg('cli:optionHelpDescription'), { short: 'h' })
  readonly help: O['help'] = false;

  @Arg.String(msg('cli:optionLocaleDescription'))
  readonly locale: O['locale'] = 'en';

  @Arg.Rest()
  readonly rest: string[] = [];

  @Arg.Flag(msg('cli:optionVersionDescription'), { short: 'v' })
  readonly version: O['version'] = false;

  constructor() {
    this.bootstrap();
  }

  /**
   * Life cycle that is executed on instantiation, so that commands,
   * params, and other settings can be defined.
   */
  bootstrap() {}

  /**
   * Exit the program with an error code.
   */
  exit(message: string, code: ExitCode) {
    throw new ExitError(message, code || 1);
  }

  /**
   * Validate and return all metadata registered to this command instance.
   */
  getMetadata(): CommandMetadata {
    const ctor = (this.constructor as unknown) as CommandStaticConfig;
    const metadata: CommandMetadata = {
      deprecated: ctor.deprecated,
      description: ctor.description,
      hidden: ctor.hidden,
      usage: ctor.usage,
      ...Reflect.getMetadata(META_CONFIG, ctor),
      commands: Reflect.getMetadata(META_COMMANDS, this) ?? {},
      options: Reflect.getMetadata(META_OPTIONS, this) ?? {},
      params: Reflect.getMetadata(META_PARAMS, this) ?? [],
      path: this.getPath(),
      rest: Reflect.getMetadata(META_REST, this),
    };

    return optimal(metadata, commandMetadataBlueprint, {
      name: this.constructor.name,
      unknown: true,
    });
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
      ((this.constructor as unknown) as CommandStaticConfig).path ||
      '';

    if (!path || typeof path !== 'string') {
      throw new Error(
        'Command registered without a canonical path. Have you configured the command?',
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
  abstract async run(...params: P): Promise<undefined | string | React.ReactElement>;
}
