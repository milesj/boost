import { Blueprint, Predicates } from 'optimal';

export interface Optionable<T extends object = {}> {
  options: Required<T>;

  blueprint(predicates: Predicates): Blueprint<T>;

  configure(options: Partial<T>): this;
}
