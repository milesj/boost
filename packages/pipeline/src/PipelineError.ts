import { createScopedError } from '@boost/internal';

const errors = {
  INVALID_ACTION: 'Work units require an executable function.',
  INVALID_ROUTINE_KEY: 'Routine key must be a valid unique string.',
  INVALID_TITLE: 'Work units require a title.',
  INVALID_WORK_UNIT:
    'Unknown work unit type. Must be a `Routine`, `Task`, `WorkUnit`, or function.',
  WORK_TIME_OUT: 'Work unit has timed out.',
};

export type PipelineErrorCode = keyof typeof errors;

export default createScopedError<PipelineErrorCode>('PLN', 'PipelineError', errors);
