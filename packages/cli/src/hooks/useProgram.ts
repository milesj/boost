import { useCallback, useContext } from 'react';
import { useApp } from 'ink';
import { ExitError } from '@boost/common';
import { EXIT_FAIL, EXIT_PASS } from '../constants';
import { ProgramContext } from '../ProgramContext';
import { ProgramContextType } from '../types';

export function useProgram(): ProgramContextType {
	const { exit: appExit } = useApp();
	const program = useContext(ProgramContext);

	const exit = useCallback(
		(error?: Error | string, code?: number) => {
			if (error) {
				appExit(new ExitError(error instanceof Error ? error.message : error, code ?? EXIT_FAIL));
			} else {
				appExit(new ExitError('', EXIT_PASS));
			}
		},
		[appExit],
	);

	return { ...program, exit };
}
