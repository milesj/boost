import JSON from 'json5';

export type JSONReviver = (key: string, value: unknown) => unknown;

export interface JSONStringifyOptions {
  space?: number | string | null;
  quote?: string | null;
  replacer?: (number | string)[] | ((key: string, value: unknown) => unknown) | null;
}

export function parse<T = object>(content: string, reviver?: JSONReviver): T {
  return JSON.parse(content, reviver);
}

export function stringify(content: unknown, options: JSONStringifyOptions = {}): string {
  return JSON.stringify(content, options);
}
