import { DEFAULT_NUMBER_VALUE } from '../constants';
import { ValueType } from '../types';

export function castValue(
	value: unknown,
	type?: 'boolean' | 'number' | 'string',
	multiple?: boolean,
): ValueType {
	if (multiple && !Array.isArray(value)) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.map((val) => castValue(val, type)) as string[];
	}

	switch (type) {
		case 'boolean': {
			const bool = String(value).toLowerCase();

			return bool === 'true' || bool === 'on' || bool === 'yes' || bool === '1';
		}

		case 'number': {
			const number = Number(value);

			return Number.isNaN(number) ? DEFAULT_NUMBER_VALUE : number;
		}

		default:
			return String(value);
	}
}
