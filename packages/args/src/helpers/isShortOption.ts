import { SHORT_OPTION_FORMAT } from '../constants';

export function isShortOption(arg: string): boolean {
	return SHORT_OPTION_FORMAT.test(arg);
}
