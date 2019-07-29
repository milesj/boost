import { Blueprint, Predicates } from 'optimal';

export type Path = string;

export type AbstractConstructor<T> = Function & { prototype: T };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConcreteConstructor<T> = new (...args: any[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

export interface Optionable<T extends object = {}> {
  readonly options: Required<T>;

  blueprint(predicates: Predicates): Blueprint<T>;
}
