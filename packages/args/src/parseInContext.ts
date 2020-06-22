import ArgsError from './ArgsError';
import parse from './parse';
import { Argv, ArgList, Arguments, ContextFactory, PrimitiveType, ParserOptions } from './types';

export default function parseInContext<O extends object = {}, P extends PrimitiveType[] = ArgList>(
  argv: Argv,
  context: ContextFactory,
): Arguments<O, P> {
  let options: ParserOptions<O, P> | undefined;

  // Loop through each arg until we find a context
  argv.some((arg) => {
    options = context(arg, argv) as ParserOptions<O, P>;

    return !!options;
  });

  // Fail if context not found
  if (!options) {
    throw new ArgsError('CONTEXT_NOT_PROVIDED');
  }

  return parse(argv, options);
}
