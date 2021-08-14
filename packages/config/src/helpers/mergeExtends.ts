import { toArray } from '@boost/common';
import { ExtendsSetting } from '../types';
import { mergeArray } from './mergeArray';

/**
 * Merges previous and next file paths (either a string or array of strings) into a
 * new list of file paths. This is useful if utilizing config extending.
 */
export function mergeExtends(prev: ExtendsSetting, next: ExtendsSetting): string[] {
	return mergeArray(toArray(prev), toArray(next));
}
