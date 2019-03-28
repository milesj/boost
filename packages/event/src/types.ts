export type Listener<A extends unknown[], R> = (...args: A) => R;

export type Scope = string;
