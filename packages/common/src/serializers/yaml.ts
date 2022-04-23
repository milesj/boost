import fs from 'fs';
import YAML, {
	CreateNodeOptions,
	DocumentOptions,
	ParseOptions,
	SchemaOptions,
	ToJSOptions,
	ToStringOptions,
} from 'yaml';
import { PortablePath } from '../types';

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
