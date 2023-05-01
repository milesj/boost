import React, { useMemo } from 'react';
import { Box } from 'ink';
import { useDimensions } from '../../hooks';
import { msg } from '../../translate';
import { Style } from '../Style';

export type OverflowLabel = string | ((count: number) => string);

export interface ScrollableItem {
	disabled?: boolean;
	divider?: boolean;
}

export interface ScrollableListProps {
	/** Number of options to display before scrolling. Defaults to console height. */
	limit?: number;
	/** Label to display above scrollable options with the number of overflowing options. */
	overflowAfterLabel?: OverflowLabel;
	/** Label to display below scrollable options with the number of overflowing options. */
	overflowBeforeLabel?: OverflowLabel;
	/**
	 * The pattern in which to limit options when scrolling. Defaults to `overflow`.
	 * - `cycle` - Will continously cycle through options, even when navigating to and past edges.
	 * - `overflow` - Will display options bound to an edge, with the number of options hidden above and below.
	 */
	scrollType?: 'cycle' | 'overflow';
}

export interface InternalScrollableListProps<T extends ScrollableItem> extends ScrollableListProps {
	currentIndex: number;
	items: T[];
	renderItem: (item: T) => React.ReactElement;
	rowHeight?: number;
}

export function calculateIndexes(
	maxIndex: number,
	currentIndex: number,
	limit: number,
	scrollType: string,
) {
	let startIndex = 0;
	let endIndex = 0;

	switch (scrollType) {
		// Current index is placed at the top, while navigation
		// always displays up to the maximum limit, and wraps around edges.
		case 'cycle':
			startIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
			endIndex = startIndex + limit - 1;

			if (endIndex > maxIndex) {
				endIndex = (endIndex - maxIndex - 1) * -1;
			}
			break;

		// Current index is placed within the middle of the limit,
		// while navigation caps at either edge.
		default: {
			const beforeLimit = Math.floor(limit / 2);
			const afterLimit = Math.floor(limit / 2) - (limit % 2 === 0 ? 1 : 0);

			if (currentIndex <= beforeLimit) {
				startIndex = 0;
				endIndex = limit - 1;
			} else if (currentIndex > maxIndex - afterLimit) {
				startIndex = maxIndex - limit + 1;
				endIndex = maxIndex;
			} else {
				startIndex = currentIndex - beforeLimit;
				endIndex = currentIndex + afterLimit;
			}
			break;
		}
	}

	return { endIndex, startIndex };
}

export function truncateList<T>(
	items: T[],
	startIndex: number,
	endIndex: number,
): {
	list: T[];
	leading: T[];
	trailing: T[];
} {
	let list: T[];
	let leading: T[] = [];
	let trailing: T[] = [];

	// Wraps past the end
	if (endIndex <= 0) {
		list = [...items.slice(startIndex), ...items.slice(0, Math.abs(endIndex) + 1)];
		trailing = items.slice(Math.abs(endIndex) + 1, startIndex);

		// Wraps past the beginning
	} else if (startIndex < 0) {
		list = [...items.slice(Math.abs(startIndex)), ...items.slice(0, endIndex + 1)];
		trailing = items.slice(endIndex + 1, Math.abs(startIndex));

		// In the middle
	} else {
		list = items.slice(startIndex, endIndex + 1);
		leading = items.slice(0, startIndex);
		trailing = items.slice(endIndex + 1);
	}

	return {
		leading,
		list,
		trailing,
	};
}

function countEnabledItems(items: ScrollableItem[]): number {
	return items.filter((i) => {
		if ('disabled' in i) {
			return !i.disabled;
		}

		if ('divider' in i) {
			return !i.divider;
		}

		return true;
	}).length;
}

function renderOverflowLabel(value: OverflowLabel | undefined, count: number): string | undefined {
	if (typeof value === 'string') {
		return value;
	}

	if (typeof value === 'function') {
		return value(count);
	}

	return undefined;
}

export function ScrollableList<T extends ScrollableItem>({
	currentIndex,
	items,
	limit,
	overflowAfterLabel,
	overflowBeforeLabel,
	renderItem,
	rowHeight = 1,
	scrollType = 'overflow',
}: InternalScrollableListProps<T>) {
	const { height: viewportHeight } = useDimensions();
	const isOverflow = scrollType === 'overflow';

	// We dont want the list to overflow past the terminal size,
	// so cap it to max number of rows that will fit in the viewport
	// eslint-disable-next-line no-magic-numbers
	const padding = isOverflow ? 4 : 2;
	const maxLimit = Math.floor(
		Math.min(limit ?? viewportHeight, viewportHeight - padding) / rowHeight,
	);

	// Slice the list according to the chosen scroll type
	const { startIndex, endIndex } = calculateIndexes(
		items.length - 1,
		currentIndex,
		maxLimit,
		scrollType,
	);
	const { leading, list, trailing } = useMemo(
		() => truncateList(items, startIndex, endIndex),
		[endIndex, items, startIndex],
	);
	const leadingCount = countEnabledItems(leading);
	const trailingCount = countEnabledItems(trailing);

	return (
		<Box flexDirection="column">
			{leadingCount > 0 && isOverflow && (
				<Box marginLeft={2}>
					<Style type="muted">
						{renderOverflowLabel(overflowBeforeLabel, leadingCount) ??
							msg('prompt:scrollOverflowBefore', { count: leadingCount })}
					</Style>
				</Box>
			)}

			{list.map((item) => renderItem(item))}

			{trailingCount > 0 && isOverflow && (
				<Box marginLeft={2}>
					<Style type="muted">
						{renderOverflowLabel(overflowAfterLabel, trailingCount) ??
							msg('prompt:scrollOverflowAfter', { count: trailingCount })}
					</Style>
				</Box>
			)}
		</Box>
	);
}
