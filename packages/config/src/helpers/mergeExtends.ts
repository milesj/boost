import { toArray } from '@boost/common';
import { ExtendsSetting } from '../types';
import mergeArray from './mergeArray';

export default function mergeExtends(prev: ExtendsSetting, next: ExtendsSetting): string[] {
	return mergeArray(toArray(prev), toArray(next));
}
