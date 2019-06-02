import optimal, { predicates, Blueprint, Predicates } from 'optimal';
import { Optionable } from './types';

export default abstract class Contract<T extends object = {}> implements Optionable<T> {
  readonly options: Required<T>;

  constructor(options?: T) {
    this.options = this.configure(options);
  }

  /**
   * Set an options object by merging the new partial and existing options
   * with the defined blueprint, while running all validation checks.
   * Freeze and return the options object.
   */
  configure(options?: Partial<T>): Required<T> {
    // We don't want the options property to be modified directly,
    // so it's read only, but we still want to modify it with this function.
    (this as any).options = Object.freeze(
      optimal({ ...this.options, ...options }, this.blueprint(predicates), {
        name: this.constructor.name,
      }),
    );

    return this.options;
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options object passed to the constructor, or when manual setting.
   */
  abstract blueprint(predicates: Predicates): Blueprint<T>;
}
