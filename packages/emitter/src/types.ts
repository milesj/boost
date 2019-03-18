// prettier-ignore
export type Arguments<T> =
  T extends (...args: infer A) => any ? A :
  T extends any[] ? T :
  never;

export type WaterfallArgument<T> = T extends (value: infer A) => any ? A : T;

// prettier-ignore
export type ListenerType<T> =
  T extends (...args: any[]) => boolean | any ? T :
  T extends any[] ? (...args: T) => boolean | void :
  never;
