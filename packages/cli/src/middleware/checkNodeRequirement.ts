import semver from 'semver';
import { Middleware } from '../types';

export default function checkNodeRequirement(range: string, throws: boolean = false): Middleware {
  return (argv, parse, logger) => {
    const { version } = process;

    if (!semver.satisfies(version, range)) {
      const message = `This tool requires a Node.js version compatible with ${range}, found ${version}.`;

      if (throws) {
        throw new Error(message);
      } else {
        logger.error(message);
      }
    }

    return parse(argv);
  };
}
