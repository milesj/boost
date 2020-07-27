import isMethod from './isMethod';

function getName(func: Object): string {
  return func.constructor.name;
}

// MethodDecorator
export default function Bind<T extends Function>(
  target: Object,
  property: string,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  if (!isMethod(target, property, descriptor) || typeof descriptor.value !== 'function') {
    throw new TypeError(`\`@Bind\` may only be applied to class methods.`);
  }

  return {
    configurable: true,
    get(this: T): T {
      const bound = descriptor.value!.bind(this) as T;

      // Only cache the bound function when in the deepest sub-class,
      // otherwise any `super` calls will overwrite each other.
      if (getName(target) === getName(this)) {
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
