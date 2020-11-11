import { useContext } from 'react';
import { useApp } from 'ink';
import { ExitError } from '@boost/common';
import ProgramContext from '../ProgramContext';
import { ProgramContextType } from '../types';
import { EXIT_FAIL } from '../constants';

export default function useProgram(): ProgramContextType {
  const { exit } = useApp();
  const program = useContext(ProgramContext);

  return {
    ...program,
    exit(error, code = EXIT_FAIL) {
      if (error) {
        exit(new ExitError(error instanceof Error ? error.message : error, code));
      } else {
        exit();
      }
    },
  };
}
