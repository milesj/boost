export class ExitError extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);

		this.code = code;
		this.name = 'ExitError';
	}
}
