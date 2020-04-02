import { Middleware } from '../types';

const middleware: Middleware = (argv, next) =>
  next(argv.length > 0 && argv[0].endsWith('/node') ? argv.slice(2) : argv);

export default middleware;
