import { CommandConfig } from '../types';
import { formatType } from './formatType';

export function formatCommandCall(name: string, metadata: CommandConfig): string {
	let output = name;

	if (metadata.params) {
		metadata.params.forEach((param) => {
			output += ' ';
			output += formatType(param, true);
		});
	}

	return output;
}
