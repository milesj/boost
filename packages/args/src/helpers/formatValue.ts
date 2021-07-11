import { ArgsError } from '../ArgsError';
import { Option, ValueType } from '../types';

export function formatValue(value: ValueType, format?: Option<ValueType>['format']): ValueType {
	let nextValue = value;
	const prevType = typeof nextValue;

	if (typeof format === 'function' && prevType !== 'boolean') {
		nextValue = format(nextValue);

		const nextType = typeof nextValue;

		if (nextType !== prevType) {
			throw new ArgsError('VALUE_INVALID_FORMAT', [prevType, nextType]);
		}
	}

	return nextValue;
}
