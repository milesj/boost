/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export type PrimitiveType = string | number | boolean;

export type RoutineConfig = {
  [key: string]: PrimitiveType | PrimitiveType[] | RoutineConfig,
};

export type Result<T> = T;

export type ResultPromise<T> = Promise<Result<T>>;

export type Task<T> = (value: Result<T>) => Result<T> | ResultPromise<T>;
