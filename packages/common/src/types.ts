import { Blueprint, Predicates } from 'optimal';

export type Path = string;

export interface Optionable<T extends object = {}> {
  readonly options: Required<T>;

  blueprint(predicates: Predicates): Blueprint<T>;
}
