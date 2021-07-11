import { createScopedError } from '@boost/internal';

const errors = {
	ACTION_REQUIRED: 'Work units require an executable function.',
	ROUTINE_INVALID_KEY: 'Routine key must be a valid unique string.',
	WORK_REQUIRED_TITLE: 'Work units require a title.',
	WORK_TIME_OUT: 'Work unit has timed out.',
	WORK_UNKNOWN: 'Unknown work unit type. Must be a `Routine`, `Task`, `WorkUnit`, or function.',
};

export type PipelineErrorCode = keyof typeof errors;

export const PipelineError = createScopedError<PipelineErrorCode>('PLN', 'PipelineError', errors);
