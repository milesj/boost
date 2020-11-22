import React, { useCallback, useState } from 'react';
import { Box, DOMElement, measureElement } from 'ink';
import { useDimensions } from '../../hooks';
import { Style } from '../Style';

interface ScrollList<T> {
  list: T[];
  leading?: number;
  trailing?: number;
}

function cycleList<T>(items: T[], currentIndex: number, limit: number): ScrollList<T> {
  const lastIndex = currentIndex + limit;
  const list = items.slice(currentIndex, currentIndex + limit);

  if (lastIndex >= items.length) {
    list.push(...items.slice(0, lastIndex - items.length));
  }

  return { list };
}

function overflowList<T>(items: T[], currentIndex: number, limit: number): ScrollList<T> {
  const { length } = items;
  const halfLimit = Math.round(limit / 2);
  let leading = 0;
  let trailing = 0;
  let list: T[];

  if (currentIndex < halfLimit) {
    list = items.slice(0, limit);
    trailing = length - limit;
  } else if (currentIndex >= length - halfLimit) {
    list = items.slice(-limit);
    leading = length - limit;
  } else {
    list = items.slice(currentIndex - halfLimit, currentIndex + halfLimit);
    leading = Math.max(0, currentIndex - halfLimit);
    trailing = Math.max(0, length - (currentIndex + halfLimit));

    // Handle odd limits correctly
    if (list.length > limit) {
      list.shift();
    }
  }

  return { leading, list, trailing };
}

export interface ScrollableListProps {
  limit?: number;
  scrollType?: 'cycle' | 'overflow';
}

export interface InternalScrollableListProps extends ScrollableListProps {
  children: NonNullable<React.ReactNode>;
  currentIndex: number;
  rowHeight?: number;
}

export function ScrollableList({
  children,
  currentIndex,
  limit,
  rowHeight = 1,
  scrollType = 'overflow',
}: InternalScrollableListProps) {
  const { height: viewportHeight } = useDimensions();
  const [currentHeight, setCurrentHeight] = useState(viewportHeight);
  const measureContainer = useCallback((ref: DOMElement | null) => {
    if (ref) {
      setCurrentHeight(measureElement(ref).height);
    }
  }, []);

  // We dont want the list to overflow past the terminal size,
  // so cap it to max number of rows that will fit in the viewport
  const padding = scrollType === 'overflow' ? 3 : 1;
  const maxLimit = Math.min(limit || currentHeight, viewportHeight - padding) / rowHeight;

  // Slice the list according to the chosen scroll type
  const items = React.Children.toArray(children);
  const { leading = 0, list, trailing = 0 } =
    scrollType === 'overflow'
      ? overflowList(items, currentIndex, maxLimit)
      : cycleList(items, currentIndex, maxLimit);

  return (
    <Box flexDirection="column" ref={measureContainer}>
      {leading > 0 && (
        <Box marginLeft={2}>
          <Style type="muted">{leading} above</Style>
        </Box>
      )}

      {list}

      {trailing > 0 && (
        <Box marginLeft={2}>
          <Style type="muted">{trailing} below</Style>
        </Box>
      )}
    </Box>
  );
}
