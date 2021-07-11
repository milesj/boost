import { LongOptionName } from './types';

export class ValidationError extends Error {
	option: string;

	constructor(message: string, option: LongOptionName = '') {
		super(message);

		this.name = 'ValidationError';
		this.option = option;
	}
}
