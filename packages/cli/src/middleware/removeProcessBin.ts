import { isNodeBinary } from '../helpers/isNodeBinary';
import { Middleware } from '../types';

export function removeProcessBin(): Middleware {
	return (argv, parse) => parse(argv.length > 0 && isNodeBinary(argv[0]) ? argv.slice(2) : argv);
}
