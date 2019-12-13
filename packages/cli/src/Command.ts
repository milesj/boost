import { InferOptionConfig, ValueType } from '@boost/args';
import registerOption from './metadata/registerOption';

export default class Command {
  async execute(): Promise<unknown> {
    return null;
  }

  registerFlag<K extends keyof this>(
    name: K,
    config: Omit<InferOptionConfig<boolean>, 'type'>,
  ): this {
    return this.registerOption(name, false, {
      ...config,
      type: 'boolean',
    });
  }

  registerOption<K extends keyof this, T extends ValueType>(
    name: K,
    defaultValue: T,
    config: InferOptionConfig<T>,
  ): this {
    registerOption(this, name, {
      ...config,
      default: defaultValue,
    });

    return this;
  }
}
