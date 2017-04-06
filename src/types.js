/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Promise from 'bluebird';

export type PrimitiveType = string | number | boolean;

export type Config = { [key: string]: PrimitiveType | PrimitiveType[] | Config };

export type GlobalConfig = {
  command: {
    name: string,
    options: string[],
  },
  config: Config,
  package: {
    name: string,
    version: string,
    [key: string]: PrimitiveType | PrimitiveType[] | Config,
  },
};

export type Result<T> = T;

export type ResultPromise<T> = Promise<Result<T>>;

export type ResultAccumulator<T1, T2> = (value: Result<T1>, item: T2) => ResultPromise<T1>;

export type Status = 'pending' | 'skipped' | 'passed' | 'failed';

export type TaskCallback<T> = (value: Result<T>) => Result<T> | ResultPromise<T>;

export type TreeNode = {
  routines?: TreeNode[],
  status: Status,
  tasks?: TreeNode[],
  time: number,
  title: string,
};
