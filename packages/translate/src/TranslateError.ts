import { createScopedError } from '@boost/internal';

const errors = {
	LOCALE_REQUIRED: 'A locale must be defined if auto-detection is disabled.',
	NAMESPACE_REQUIRED: 'A namespace is required for translations.',
	RESOURCE_PATH_INVALID: 'Resource path "{0}" must be a directory.',
	RESOURCES_REQUIRED: 'At least 1 resource directory path is required.',
};

export type TranslateErrorCode = keyof typeof errors;

export const TranslateError = createScopedError<TranslateErrorCode>(
	'TLT',
	'TranslateError',
	errors,
);
