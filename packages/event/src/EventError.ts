import { createScopedError } from '@boost/internal';

const errors = {
  LISTENER_INVALID: 'Invalid event listener for "%s", must be a function.',
  NAME_INVALID:
    'Invalid event %s "%s". May only contain dashes, periods, and lowercase characters.',
};

export type EventErrorCode = keyof typeof errors;

export default createScopedError<EventErrorCode>('EVT', 'EventError', errors);
