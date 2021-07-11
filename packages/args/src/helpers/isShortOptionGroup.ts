import { SHORT_OPTION_GROUP_FORMAT } from '../constants';

export function isShortOptionGroup(arg: string): boolean {
	return SHORT_OPTION_GROUP_FORMAT.test(arg);
}
