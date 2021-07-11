import { LONG_OPTION_FORMAT } from '../constants';

export function isLongOption(arg: string): boolean {
	return LONG_OPTION_FORMAT.test(arg);
}
