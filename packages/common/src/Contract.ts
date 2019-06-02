import optimal, { predicates, Blueprint, Predicates } from 'optimal';
import { Optionable } from './types';

export default abstract class Contract<T extends object = {}> implements Optionable<T> {
  options: Required<T>;

  constructor(options?: T) {
    this.options = this.setOptions(options);
  }

  /**
   * Set a new options object by merging the passed partial options
   * with the defined blueprint, while running all validation checks.
   * Return the new options object.
   */
  setOptions(options?: T): Required<T> {
    this.options = optimal({ ...options }, this.blueprint(predicates), {
      name: this.constructor.name,
    });

    return this.options;
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options object passed to the constructor, or when manual setting.
   */
  abstract blueprint(predicates: Predicates): Blueprint<T>;
}
