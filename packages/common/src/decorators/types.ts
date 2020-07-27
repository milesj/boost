export type InternalClassDecorator<T extends Function> = (target: T) => T | void;

export type InternalPropertyDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor?: TypedPropertyDescriptor<unknown>,
) => void;

export type InternalMethodDecorator<T extends Function> = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;

export type InternalParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void;
