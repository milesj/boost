import { createScopedError } from '@boost/internal';

const errors = {
	PARSE_INVALID_EXT: 'Unable to parse file "{0}". Unsupported file extension.',
	PATH_REQUIRE_ABSOLUTE: 'An absolute file path is required.',
	PATH_RESOLVE_LOOKUPS: 'Failed to resolve a path using the following lookups (in order):\n{0}\n',
	PROJECT_NO_PACKAGE: 'No `package.json` found within project root.',
};

export type CommonErrorCode = keyof typeof errors;

export const CommonError = createScopedError<CommonErrorCode>('CMN', 'CommonError', errors);
