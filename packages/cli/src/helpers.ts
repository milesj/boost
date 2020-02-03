import { stripAnsi, style } from '@boost/terminal';
import { PrimitiveType } from '@boost/args/src';

export function applyMarkdown(text: string): string {
  return text.replace(/(?:\*|~|_){1,2}([^*~_]+)(?:\*|~|_){1,2}/giu, (match, body) => {
    if (match.startsWith('~')) {
      return style.strikethrough(body);
    } else if (match.startsWith('**') || match.startsWith('__')) {
      return style.bold(body);
    } else if (match.startsWith('*') || match.startsWith('_')) {
      return style.italic(body);
    }

    return match;
  });
}

export function formatValue(value: PrimitiveType): string {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    default:
      return String(value);
  }
}

export function formatDescription(
  config: {
    choices?: PrimitiveType[];
    default?: PrimitiveType;
    description: string;
    deprecated?: boolean;
  },
  tags: string[] = [],
): string {
  let output = applyMarkdown(config.description);

  // Append choices after the description
  if (config.choices) {
    const choices = config.choices.map(
      choice => formatValue(choice) + (config.default === choice ? ' (default)' : ''),
    );

    output += ` (choices: ${choices.join(', ')})`;

    // Append default after description if no choices
  } else if (config.default) {
    output += ` (default: ${formatValue(config.default)})`;
  }

  // Tags go at the end of the description
  if (config.deprecated) {
    tags.unshift('deprecated');
  }

  if (tags.length > 0) {
    output += ' ';
    output += style.gray(`[${tags.join(', ')}]`);
  }

  return output;
}

export function formatType(
  config: {
    label?: string;
    multiple?: boolean;
    required?: boolean;
    type: string;
  },
  inline: boolean = false,
): string {
  let type = config.type + (config.multiple ? '[]' : '');

  if (inline) {
    if (config.label) {
      type = config.label;
    }

    type = config.required ? `<${type}>` : `[${type}]`;
  }

  return style.gray(type);
}

export function getLongestWidth(values: string[]): number {
  return values.reduce((sum, value) => {
    const text = stripAnsi(value);

    return text.length > sum ? text.length : sum;
  }, 0);
}
