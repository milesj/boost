export default function truncateList<T>(
  list: T[],
  currentIndex: number,
  limit?: number,
): { list: T[]; leading: number; trailing: number } {
  let leading = 0;
  let trailing = 0;

  if (!limit) {
    return { leading, list, trailing };
  }

  const { length } = list;
  const halfLimit = Math.round(limit / 2);
  let newList;

  if (currentIndex < halfLimit) {
    newList = list.slice(0, limit);
    trailing = length - limit;
  } else if (currentIndex >= length - halfLimit) {
    newList = list.slice(-limit);
    leading = length - limit;
  } else {
    newList = list.slice(currentIndex - halfLimit, currentIndex + halfLimit);
    leading = Math.max(0, currentIndex - halfLimit + 1);
    trailing = Math.max(0, length - (currentIndex + halfLimit));

    // Handle even/odd limits correctly
    if (newList.length > limit) {
      newList.shift();
      leading -= 1;
    }
  }

  return { leading, list: newList, trailing };
}
