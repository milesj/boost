import { style } from '@boost/terminal';

export function applyMarkdown(text: string): string {
	return text.replace(/(?:\*|~|_){1,2}([^*~_]+)(?:\*|~|_){1,2}/giu, (match, body) => {
		if (match.startsWith('~')) {
			return style.strikethrough(body);
		}

		if (match.startsWith('**') || match.startsWith('__')) {
			return style.bold(body);
		}

		if (match.startsWith('*') || match.startsWith('_')) {
			return style.italic(body);
		}

		// istanbul ignore next
		return match;
	});
}
