import { useCallback, useState } from 'react';

export function useListNavigation(
	list: { disabled?: boolean; divider?: boolean }[],
	defaultIndex?: number,
) {
	const getNextIndex = useCallback(
		(index: number, step: number) => {
			let nextIndex = index;

			if (nextIndex >= list.length) {
				nextIndex = 0;
			} else if (nextIndex < 0) {
				nextIndex = list.length - 1;
			}

			if (list[nextIndex]?.disabled || list[nextIndex]?.divider) {
				nextIndex = getNextIndex(nextIndex + step, step);
			}

			return nextIndex;
		},
		[list],
	);

	const [highlightedIndex, setHighlightedIndex] = useState(
		() => defaultIndex ?? getNextIndex(0, 1),
	);

	const onKeyDown = useCallback(() => {
		setHighlightedIndex((index) => getNextIndex(index + 1, 1));
	}, [getNextIndex]);

	const onKeyUp = useCallback(() => {
		setHighlightedIndex((index) => getNextIndex(index - 1, -1));
	}, [getNextIndex]);

	const onKeyLeft = useCallback(() => {
		setHighlightedIndex(getNextIndex(0, 1));
	}, [getNextIndex]);

	const onKeyRight = useCallback(() => {
		setHighlightedIndex(getNextIndex(list.length - 1, -1));
	}, [getNextIndex, list]);

	return {
		highlightedIndex,
		onKeyDown,
		onKeyLeft,
		onKeyRight,
		onKeyUp,
	};
}
