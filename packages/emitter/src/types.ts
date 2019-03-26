export type BaseListener<
  R,
  T1 = undefined,
  T2 = undefined,
  T3 = undefined,
  T4 = undefined,
  T5 = undefined
> = T1 extends undefined
  ? () => R
  : T2 extends undefined
  ? (a1: T1) => R
  : T3 extends undefined
  ? (a1: T1, a2: T2) => R
  : T4 extends undefined
  ? (a1: T1, a2: T2, a3: T3) => R
  : T5 extends undefined
  ? (a1: T1, a2: T2, a3: T3, a4: T4) => R
  : (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5) => R;

export type Listener<
  T1 = undefined,
  T2 = undefined,
  T3 = undefined,
  T4 = undefined,
  T5 = undefined
> = BaseListener<boolean | void, T1, T2, T3, T4, T5>;

export type ParallelListener<
  T1 = undefined,
  T2 = undefined,
  T3 = undefined,
  T4 = undefined,
  T5 = undefined
> = BaseListener<Promise<unknown>, T1, T2, T3, T4, T5>;

export type WaterfallListener<T> = BaseListener<T, T>;

export type ListenerType<T> = T extends (...args: unknown[]) => unknown ? T : never;

export type Arguments<T> = T extends (...args: infer A) => unknown ? A : never;

export type WaterfallArgument<T> = T extends (arg: infer A) => unknown ? A : never;
