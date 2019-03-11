import isObject from './helpers/isObject';

export default class Context {
  /**
   * Create a new instance of the current context and shallow clone all properties.
   */
  clone(...args: any[]): this {
    // @ts-ignore Not sure how to reflect the constructor of sub-classes
    const context = new this.constructor(...args);

    // Copy enumerable properties
    Object.keys(this).forEach(key => {
      const prop = key as keyof this;
      let value: any = this[prop];

      if (Array.isArray(value)) {
        value = [...value];
      } else if (value instanceof Map) {
        value = new Map(value);
      } else if (value instanceof Set) {
        value = new Set(value);
      } else if (value instanceof Date) {
        value = new Date(value.getTime());
      } else if (isObject(value)) {
        // Dont dereference instances, only plain objects
        if (value.constructor === Object) {
          value = { ...value };
        }
      }

      context[prop] = value;
    });

    return context;
  }
}
