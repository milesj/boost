import { stripAnsi } from '@boost/terminal';

export function getLongestWidth(values: string[]): number {
	return values.reduce((sum, value) => {
		const text = stripAnsi(value);

		return text.length > sum ? text.length : sum;
	}, 0);
}
