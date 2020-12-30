import { useContext } from 'react';
import { useApp } from 'ink';
import { ExitError } from '@boost/common';
import { EXIT_FAIL, EXIT_PASS } from '../constants';
import ProgramContext from '../ProgramContext';
import { ProgramContextType } from '../types';

export function useProgram(): ProgramContextType {
  const { exit } = useApp();
  const program = useContext(ProgramContext);

  return {
    ...program,
    // Ink has its own mechanism for triggering an exit that differs from our Program.
    // So we need to override our exit with their exit, and utilize `ExitError` so
    // that our error codes are persisted upstream when thrown.
    exit(error, code) {
      if (error) {
        exit(new ExitError(error instanceof Error ? error.message : error, code ?? EXIT_FAIL));
      } else {
        exit(new ExitError('', EXIT_PASS));
      }
    },
  };
}
