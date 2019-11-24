import { Blueprint, Predicates } from 'optimal';

export type FilePath = string;

export type AbstractConstructor<T> = Function & { prototype: T };

export type ConcreteConstructor<T> = new (...args: unknown[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

export interface Optionable<T extends object = {}> {
  readonly options: Required<T>;

  blueprint(predicates: Predicates): Blueprint<T>;
}
