import { Blueprint, Predicates } from 'optimal';

export type Path = string;

export type AbstractConstructor<T> = Function & { prototype: T };

export type ConcreteConstructor<T> = new (...args: any[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

export interface Optionable<T extends object = {}> {
  options: Required<T>;

  blueprint(predicates: Predicates): Blueprint<T>;
}
