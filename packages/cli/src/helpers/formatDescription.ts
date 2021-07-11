import { PrimitiveType } from '@boost/args';
import { msg } from '../translate';
import { applyMarkdown } from './applyMarkdown';
import { applyStyle } from './applyStyle';
import { formatValue } from './formatValue';

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
		const choices = config.choices.map((choice) => formatValue(choice));

		output += ` (${msg('cli:tagChoices')}: ${choices.join(', ')})`;
	}

	// Append default last
	if (config.default) {
		output += ` (${msg('cli:tagDefault')}: ${formatValue(config.default)})`;
	}

	// Tags go at the end of the description
	if (config.deprecated) {
		tags.unshift(msg('cli:tagDeprecated'));
	}

	if (tags.length > 0) {
		output += ' ';
		output += applyStyle(`[${tags.join(', ')}]`, 'muted');
	}

	return output;
}
