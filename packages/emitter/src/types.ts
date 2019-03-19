// prettier-ignore
export type Arguments<T> =
  T extends (...args: infer A) => any ? A :
  T extends any[] ? T :
  never;

// type A = Arguments<[number]>;
// type B = Arguments<[number, string]>;
// type C = Arguments<[number, boolean, string?]>;
// type D = Arguments<() => void>;
// type E = Arguments<(a: string) => boolean | void>;
// type F = Arguments<(a: string, b: number) => boolean | void>;
// type G = Arguments<(a: string, b: number, c?: object) => string>;

export type WaterfallArgument<T> = T extends (value: infer A) => any ? A : T;

// prettier-ignore
export type ListenerType<T> =
  T extends (...args: any[]) => boolean | any ? T :
  T extends any[] ? (...args: T) => boolean | void :
  never;

// type H = ListenerType<(a: string, b: number, c?: object) => string>;
// type I = ListenerType<(a: string) => Promise<boolean>>;
// type J = ListenerType<(a: string, b: number) => boolean | void>;
// type K = ListenerType<[number, boolean, string?]>;
// type L = ListenerType<[number]>;
// type M = ListenerType<[]>;
// type N = ListenerType<{}>;
