// prettier-ignore
export type ArgumentsOf<T> =
  T extends (...args: infer A) => any ? A :
  T extends any[] ? T :
  never;

// prettier-ignore
export type ListenerOf<T> =
  T extends (...args: any[]) => any ? T :
  T extends any[] ? (...args: T) => false | void :
  never;
