import { Middleware } from '../types';

export default function removeProcessBin(): Middleware {
  return (argv, parse) =>
    parse(argv.length > 0 && argv[0].endsWith('/node') ? argv.slice(2) : argv);
}
