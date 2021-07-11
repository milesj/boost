import { createScopedError } from '@boost/internal';

const errors = {
	LISTENER_INVALID: 'Invalid event listener for "{0}", must be a function.',
	NAME_INVALID:
		'Invalid event {0} "{1}". May only contain dashes, periods, and lowercase characters.',
};

export type EventErrorCode = keyof typeof errors;

export const EventError = createScopedError<EventErrorCode>('EVT', 'EventError', errors);
