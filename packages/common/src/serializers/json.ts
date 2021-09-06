import fs from 'fs';
import JSON from 'json5';
import { PortablePath } from '../types';

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

export function load<T>(path: PortablePath | URL): T {
	// @ts-expect-error Mismatch between node and dom URL
	return parse(fs.readFileSync(path instanceof URL ? path : String(path), 'utf8'));
}
