import { OPTION_LIKE } from '../constants';

/**
 * Check that an argument looks like a long, short, or flag group option.
 * Do not return true for negative numbers.
 */
export default function isOptionLike(arg: string): boolean {
  return OPTION_LIKE.test(arg);
}
