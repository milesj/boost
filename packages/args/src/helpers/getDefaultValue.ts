import { DEFAULT_BOOLEAN_VALUE, DEFAULT_NUMBER_VALUE, DEFAULT_STRING_VALUE } from '../constants';
import { OptionConfig, ValueType } from '../types';

export function getDefaultValue(config: OptionConfig): ValueType {
	let value = config.default as ValueType;

	if (value === undefined) {
		if (config.multiple) {
			value = [];
		} else if (config.type === 'boolean') {
			value = DEFAULT_BOOLEAN_VALUE;
		} else if (config.type === 'number') {
			value = DEFAULT_NUMBER_VALUE;
		} else {
			value = DEFAULT_STRING_VALUE;
		}
	}

	return value;
}
