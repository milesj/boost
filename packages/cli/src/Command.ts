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
import { GlobalOptions } from './types';
import { msg, META_OPTIONS, META_PARAMS } from './constants';

export default abstract class Command<
  O extends GlobalOptions,
  P extends PrimitiveType[] = ArgList
> {
  wtf: boolean = true;

  @Arg.Flag(msg('cli:optionHelpDescription'), { short: 'h' })
  help: boolean = false;

  @Arg.String(msg('cli:optionLocaleDescription'))
  locale: string = 'en';

  @Arg.Rest()
  rest: string[] = ['foo'];

  @Arg.Flag(msg('cli:optionVersionDescription'), { short: 'v' })
  version: boolean = true;

  getMetadata() {}

  getParserOptions(): ParserOptions<O, P> {
    return {
      options: Reflect.getMetadata(META_OPTIONS, this) || {},
      params: Reflect.getMetadata(META_PARAMS, this),
    };
  }

  registerOptions(options: MapOptionConfig<O>): this {
    Object.entries(options).forEach(([option, config]) => {
      registerOption(this, option as keyof this, config as OptionConfig);
    });

    return this;
  }

  registerParams(property: keyof this, params: MapParamConfig<P>): this {
    registerParams(this, property, params);

    return this;
  }

  abstract async execute(): Promise<unknown>;
}
