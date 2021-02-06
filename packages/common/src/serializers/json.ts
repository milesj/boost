import JSON from 'json5';

export type JSONReplacer = (key: string, value: unknown) => (number | string)[] | unknown | null;

export type JSONReviver = (key: string, value: unknown) => unknown;

export interface JSONStringifyOptions {
  space?: number | string;
  quote?: string;
  replacer?: JSONReplacer;
}

export function parse<T = object>(content: string, reviver?: JSONReviver): T {
  return JSON.parse(content, reviver);
}

export function stringify(content: unknown, options?: JSONStringifyOptions): string {
  return JSON.stringify(content, options);
}
