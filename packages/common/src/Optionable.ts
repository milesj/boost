import optimal, { predicates, Blueprint, Predicates } from 'optimal';

export default abstract class Optionable<T extends object = {}> {
  options: Required<T>;

  constructor(options?: T) {
    this.options = optimal({ ...options }, this.blueprint(predicates), {
      name: this.constructor.name,
    });
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options object passed to the constructor.
   */
  abstract blueprint(predicates: Predicates): Blueprint<T>;
}
