import { Blueprint, Predicates } from 'optimal';
import Path from './Path';

// NODE

export type ModuleName = string;

// FILE SYSTEM

export type FilePath = string;

export type PortablePath = FilePath | Path;

export enum LookupType {
  FILE_SYSTEM = 'FILE_SYSTEM',
  NODE_MODULE = 'NODE_MODULE',
}

export interface Lookup {
  path: Path;
  raw: Path;
  type: LookupType;
}

// CLASSES

export type AbstractConstructor<T> = Function & { prototype: T };

export type ConcreteConstructor<T> = new (...args: unknown[]) => T;

export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;

// INTERFACES

export type BlueprintFactory<T extends object> = (predicates: Predicates) => Blueprint<T>;

export interface Optionable<T extends object = {}> {
  readonly options: Required<T>;

  blueprint: BlueprintFactory<T>;
}

export interface Toolable {
  name: string;
}

// MISC
