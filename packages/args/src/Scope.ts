import { castValue } from './helpers/castValue';
import { formatValue } from './helpers/formatValue';
import { LongOptionName, OptionConfig, ValueType } from './types';

export class Scope {
	config: OptionConfig;

	name: LongOptionName;

	negated: boolean = false;

	unknown: boolean = false;

	value?: string[] | string;

	constructor(name: LongOptionName, config?: OptionConfig) {
		this.name = name;

		if (config) {
			this.config = config;
		} else {
			this.config = { description: '', type: 'string' };
			this.unknown = true;
		}
	}

	get flag(): boolean {
		return this.config.type === 'boolean';
	}

	get finalValue(): ValueType {
		return formatValue(castValue(this.value, this.config.type), this.config.format);
	}

	captureValue(value: string, commit: () => void) {
		const { config } = this;

		// Update the scope with this new value
		if (config.multiple) {
			(this.value as string[]).push(value);
		} else {
			this.value = value;
		}

		// Commit scope when a single value is set,
		// or when a multiple arity is met.
		if (
			!config.multiple ||
			(config.arity && Array.isArray(this.value) && this.value.length >= config.arity)
		) {
			commit();
		}
	}
}
