import { LongOptionName, OptionConfig, ValueType } from './types';

export default class Scope {
  config: OptionConfig;

  name: LongOptionName;

  negated: boolean = false;

  value?: string | string[];

  constructor(name: LongOptionName, config: OptionConfig) {
    this.name = name;
    this.config = config;
  }

  get flag(): boolean {
    return this.config.type === 'boolean';
  }

  get finalValue(): ValueType {
    return this.castValue(this.value!);
  }

  castValue(value: unknown): ValueType {
    const { type } = this.config;

    if (Array.isArray(value)) {
      return value.map(val => this.castValue(val)) as string[];
    }

    switch (type) {
      case 'boolean':
        return Boolean(value);

      case 'number': {
        const number = Number(value);

        return Number.isNaN(number) ? 0 : number;
      }

      default:
        return String(value);
    }
  }

  captureValue(value: string, commit: () => void) {
    const { config } = this;

    // Update the scope with this new value
    if (config.multiple) {
      if (!Array.isArray(this.value)) {
        this.value = [];
      }

      this.value.push(value);
    } else {
      this.value = value;
    }

    // Commit scope when a single value is set,
    // or when a multiple arity is met
    if (
      !config.multiple ||
      (config.arity && Array.isArray(this.value) && this.value.length >= config.arity)
    ) {
      commit();
    }
  }
}
