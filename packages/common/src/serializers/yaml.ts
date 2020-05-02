import YAML from 'yaml';

export function parse<T = object>(content: string, options?: YAML.Options): T {
  return YAML.parse(content, options);
}

export function stringify(content: unknown, options?: YAML.Options): string {
  return YAML.stringify(content, options);
}
