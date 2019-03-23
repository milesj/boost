export type Listener<T extends unknown[] = [], R = boolean | void> = (...args: T) => R;

export type ParallelListener<T extends unknown[] = []> = Listener<T, Promise<unknown>>;

export type WaterfallListener<T> = Listener<[T], T>;

// VALID
// type A = Listener<[string]>;
// type B = Listener<[string, number], object>;
// type C = ParallelListener<[string, number]>;
// type F = WaterfallListener<string>;

// prettier-ignore
export type Arguments<T> =
  T extends (...args: infer A) => unknown ? A :
  // T extends unknown[] ? T :
  never;

// VALID
type A = Arguments<Listener<[number]>>;
type B = Arguments<Listener<[number, string]>>;
type C = Arguments<Listener<[number, boolean, string?]>>;
type D = Arguments<Listener>;
type E = Arguments<(a: string) => boolean | void>;
type F = Arguments<(a: string, b: number) => boolean | void>;
type G = Arguments<(a: string, b: number, c?: object) => string>;
// type A = Arguments<[number]>;
// type B = Arguments<[number, string]>;
// type C = Arguments<[number, boolean, string?]>;
// type D = Arguments<() => void>;
// type E = Arguments<(a: string) => boolean | void>;
// type F = Arguments<(a: string, b: number) => boolean | void>;
// type G = Arguments<(a: string, b: number, c?: object) => string>;

export type WaterfallArgument<T> = T extends (value: infer A) => unknown ? A : T;

// prettier-ignore
export type ListenerType<T> =
  T extends (...args: any[]) => any ? T :
  // T extends unknown[] ? (...args: T) => boolean | void :
  never;

// VALID
// type H = ListenerType<(a: string, b: number, c?: object) => string>;
// type I = ListenerType<(a: string) => Promise<boolean>>;
// type J = ListenerType<(a: string, b: number) => boolean | void>;
// type K = ListenerType<[number, boolean, string?]>;
// type L = ListenerType<[number]>;
// type M = ListenerType<[]>;
// type N = ListenerType<{}>;