import { OPTION_LIKE } from '../constants';

/**
 * Check that an argument looks like a long option, short option,
 * or short option group. Do not return true for negative numbers.
 */
export function isOptionLike(arg: string): boolean {
	return OPTION_LIKE.test(arg);
}
