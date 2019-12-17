import { Argv } from '@boost/args';
import { Contract, Predicates } from '@boost/common';
import { CLIOptions } from './types';

export default class CLI extends Contract<CLIOptions> {
  blueprint({ string }: Predicates) {
    return {
      bin: string().required(),
      name: string().required(),
      version: string().required(),
    };
  }

  run(argv: Argv) {}
}
