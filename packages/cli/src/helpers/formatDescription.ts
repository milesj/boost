import { style } from '@boost/terminal';
import { PrimitiveType } from '@boost/args';
import applyMarkdown from './applyMarkdown';
import formatValue from './formatValue';

export default function formatDescription(
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
