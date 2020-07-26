function getName(func: Object): string {
  return func.constructor.name;
}

// MethodDecorator
export default function Bind<T extends Function>(
  prototype: Object,
  property: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  if (!descriptor || typeof descriptor.value !== 'function') {
    throw new TypeError(
      `Only class methods can be decorated with \`@Bind\`. "${String(property)}" is not a method.`,
    );
  }

  return {
    configurable: true,
    get(this: T): T {
      const bound = descriptor.value!.bind(this) as T;

      // Only cache the bound function when in the deepest sub-class,
      // otherwise any `super` calls will overwrite each other.
      if (getName(prototype) === getName(this)) {
        Object.defineProperty(this, property, {
          configurable: true,
          value: bound,
          writable: true,
        });
      }

      return bound;
    },
  };
}
