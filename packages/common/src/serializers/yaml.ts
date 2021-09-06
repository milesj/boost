import fs from 'fs';
import YAML from 'yaml';
import { PortablePath } from '../types';

export function parse<T = object>(content: string, options?: YAML.Options): T {
	return YAML.parse(content, options) as T;
}

export function stringify(content: unknown, options?: YAML.Options): string {
	return YAML.stringify(content, options);
}

export function load<T>(path: PortablePath | URL): T {
	// @ts-expect-error Mismatch between node and dom URL
	return parse(fs.readFileSync(path instanceof URL ? path : String(path), 'utf8'));
}
