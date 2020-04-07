import getConstructor from './getConstructor';
import { Categories } from '../types';

export default function getInheritedCategories(base: Object): Categories {
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
