// eslint-disable-next-line import/prefer-default-export
export type Listener<A extends unknown[], R> = (...args: A) => R;
