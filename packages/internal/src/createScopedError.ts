const internalErrors = {
	INVALID_SCOPE_NAME: 'Error scope must be 3 characters and all uppercase.',
	UNKNOWN_ERROR: 'An unknown error has occurred.',
};

const TOKEN_PATTERN = /\{(\d+)\}/gu;

export type Errors = Record<string, string>;

export interface ScopedError<Code extends string = string> {
	code: Code | 'UNKNOWN_ERROR';
	scope: string;
}

export function createScopedError<Code extends string = string>(
	scope: string,
	name: string,
	errors: Errors,
): new (code: Code, params?: unknown[]) => Error & ScopedError<Code> {
	function msg(code: string, messages: Errors, params: unknown[] = []): string {
		if (!messages[code]) {
			return '';
		}

		return `${messages[code].replace(TOKEN_PATTERN, (match, index) =>
			String(params[index as number]),
		)} [${scope}:${code}]`;
	}

	if (__DEV__ && (scope.length !== 3 || scope !== scope.toUpperCase())) {
		throw new Error(msg('INVALID_SCOPE_NAME', internalErrors));
	}

	return class InternalError extends Error implements ScopedError<Code> {
		code: Code | 'UNKNOWN_ERROR';

		scope: string = scope;

		constructor(code: Code, params?: unknown[]) {
			super(msg(code, errors, params));

			this.code = code;
			this.name = name;

			// If a message was not loaded, we are throwing an unknown error
			if (!this.message) {
				this.code = 'UNKNOWN_ERROR';
				this.message = msg('UNKNOWN_ERROR', internalErrors);
			}
		}
	};
}
