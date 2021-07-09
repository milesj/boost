export type PathLike = string | { toString: () => string };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Module {
      _compile: (code: string, file: string) => unknown;
    }
  }
}
