import { createScopedError } from '@boost/internal';

const errors = {
  INVALID_LISTENER: 'Invalid event listener for "%s", must be a function.',
  INVALID_NAME:
    'Invalid event %s "%s". May only contain dashes, periods, and lowercase characters.',
};

export type EventErrorCode = keyof typeof errors;

export default createScopedError<EventErrorCode>('EVT', 'EventError', errors);
