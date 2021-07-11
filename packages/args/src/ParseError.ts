export class ParseError extends Error {
	arg: string;

	index: number;

	constructor(message: string, arg: string, index: number) {
		super(message);

		this.name = 'ParseError';
		this.arg = arg;
		this.index = index;
	}
}
