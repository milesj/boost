import { isObject, Contract, Predicates } from '@boost/common';
import mergeArray from './mergeArray';
import mergeObject from './mergeObject';
import { Handler, ProcessorOptions } from './types';

export default class Processor<T extends object> extends Contract<ProcessorOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected handlers: { [K in keyof T]?: Handler<any> } = {};

  blueprint({ string }: Predicates) {
    return {
      extendsSetting: string(),
      overridesSetting: string(),
    };
  }

  addHandler<K extends keyof T, V = T[K]>(key: K, handler: Handler<V>): this {
    this.handlers[key] = handler;

    return this;
  }

  process(defaults: Required<T>, configs: Partial<T>[]): Required<T> {
    return configs.reduce<Required<T>>((config, next) => this.runProcess(config, next), defaults);
  }

  protected runProcess(prev: Required<T>, next: Partial<T>): Required<T> {
    // const { extendsSetting, overridesSetting } = this.options;
    const config = { ...prev };

    Object.entries(next).forEach(([key, value]) => {
      const name = key as keyof T;
      const nextValue = value as T[keyof T];
      const prevValue = config[name];
      const handler = this.handlers[name];

      // Handlers only run on the root settings
      if (handler) {
        config[name] = handler(prevValue, nextValue);

        return;
      }

      if (isObject(prevValue) && isObject(nextValue)) {
        config[name] = mergeObject(prevValue, nextValue);
      } else if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
        config[name] = mergeArray(prevValue, nextValue);
      } else if (nextValue !== undefined) {
        config[name] = nextValue;
      }
    });

    return config;
  }
}
