import optimal, { predicates, Blueprint, Predicates } from 'optimal';

export default abstract class Optionable<T extends object = {}> {
  options: Required<T>;

  constructor(options?: T) {
    this.options = this.doConfigure(options);
  }

  /**
   * Validate and build the options object using optimal.
   */
  configure(options: Partial<T>): this {
    this.options = this.doConfigure(options);

    return this;
  }

  /**
   * Protected helper to execute optimal.
   */
  private doConfigure(options?: Partial<T>): Required<T> {
    return optimal(
      {
        ...this.options,
        ...options,
      },
      this.blueprint(predicates),
      {
        name: this.constructor.name,
      },
    );
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options object passed to the constructor.
   */
  abstract blueprint(predicates: Predicates): Blueprint<T>;
}
