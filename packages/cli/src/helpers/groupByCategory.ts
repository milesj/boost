import { Categories } from '../types';

export interface CategoryItemMap<T> {
  [category: string]: {
    items: T[];
    name: string;
  };
}

export default function groupByCategory<
  T extends { category?: string; hidden?: boolean; name: string }
>(items: T[], categories: Categories): CategoryItemMap<T> {
  const weightedCategories = Object.entries(categories).map(([key, category]) => ({
    key,
    weight: 10,
    ...(typeof category === 'string' ? { name: category } : category),
  }));

  // Sort by weight, then name
  weightedCategories.sort((a, b) => {
    const diff = a.weight - b.weight;

    return diff === 0 ? a.name.localeCompare(b.name) : diff;
  });

  // Uncategorized always go first
  weightedCategories.unshift({
    key: 'uncategorized',
    name: '',
    weight: 0,
  });

  // Create a mapping
  const map: CategoryItemMap<T> = {};

  weightedCategories.forEach(category => {
    map[category.key] = {
      items: [],
      name: category.name,
    };
  });

  // Map items to their category
  items.forEach(item => {
    if (!item.hidden) {
      map[item.category || 'uncategorized'].items.push(item);
    }
  });

  // Sort by name
  Object.entries(map).forEach(([key, record]) => {
    if (record.items.length === 0) {
      delete map[key];
    } else {
      record.items.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return map;
}
