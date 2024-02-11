import fs from 'node:fs';
import type {
	CreateNodeOptions,
	DocumentOptions,
	ParseOptions,
	SchemaOptions,
	ToJSOptions,
	ToStringOptions,
} from 'yaml';
import YAML from 'yaml';
import type { PortablePath } from '../types';

export function parse<T = object>(
	content: string,
	options?: DocumentOptions & ParseOptions & SchemaOptions & ToJSOptions,
): T {
	return YAML.parse(content, options) as T;
}

export function stringify(
	content: unknown,
	options?: CreateNodeOptions & DocumentOptions & ParseOptions & SchemaOptions & ToStringOptions,
): string {
	return YAML.stringify(content, options);
}

export function load<T>(path: PortablePath): T {
	return parse(fs.readFileSync(String(path), 'utf8'));
}
