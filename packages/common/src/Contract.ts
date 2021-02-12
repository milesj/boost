import optimal, { Blueprint, Predicates, predicates } from 'optimal';
import { Optionable } from './types';

export default abstract class Contract<T extends object = {}> implements Optionable<T> {
  readonly options: Readonly<Required<T>>;

  constructor(options?: T) {
    this.options = this.configure(options);
  }

  /**
   * Set an options object by merging the new partial and existing options
   * with the defined blueprint, while running all validation checks.
   * Freeze and return the options object.
   */
  configure(options?: Partial<T> | ((options: Required<T>) => Partial<T>)): Readonly<Required<T>> {
    const nextOptions = typeof options === 'function' ? options(this.options) : options;

    // We don't want the options property to be modified directly,
    // so it's read only, but we still want to modify it with this function.
    // @ts-expect-error
    this.options = Object.freeze(
      optimal(
        { ...this.options, ...nextOptions },
        this.blueprint(predicates, this.options === undefined) as Blueprint<T>,
        {
          name: this.constructor.name,
        },
      ),
    );

    return this.options;
  }

  /**
   * Define an optimal blueprint in which to validate and build the
   * options object passed to the constructor, or when manual setting.
   */
  abstract blueprint(predicates: Predicates, onConstruction?: boolean): Blueprint<object>;
}
