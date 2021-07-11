/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Categories } from '../types';
import { getConstructor } from './getConstructor';

export function getInheritedCategories(base: Object): Categories {
	const categories: Categories = {};
	let target = Object.getPrototypeOf(base);

	while (target) {
		const ctor = getConstructor(target);

		if (ctor.categories) {
			Object.assign(categories, ctor.categories);
		} else {
			break;
		}

		target = Object.getPrototypeOf(target);
	}

	return categories;
}
