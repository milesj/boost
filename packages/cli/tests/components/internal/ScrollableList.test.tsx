/* eslint-disable react/prop-types */

import React from 'react';
import { Box, Text } from 'ink';
import { render } from 'ink-testing-library';
import {
  ScrollableList,
  InternalScrollableListProps,
  calculateIndexes,
  truncateList,
} from '../../../src/components/internal/ScrollableList';

const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const maxIndex = items.length - 1;

describe('ScrollableList', () => {
  const props: InternalScrollableListProps<{
    disabled?: boolean;
    divider?: boolean;
    value: string;
  }> = {
    currentIndex: 2,
    limit: 3,
    items: [{ value: 'a' }, { value: 'b' }, { value: 'c' }, { value: 'd' }, { value: 'e' }],
    renderItem: ({ value }) => (
      <Box key={value}>
        <Text>{value}</Text>
      </Box>
    ),
  };

  it('supports rows that are more than 1 height', () => {
    const { lastFrame } = render(
      <ScrollableList
        {...props}
        currentIndex={0}
        limit={5}
        rowHeight={2}
        renderItem={({ value }) => (
          <React.Fragment key={value}>
            <Box>
              <Text>{value}</Text>
            </Box>
            <Box>
              <Text>{value}</Text>
            </Box>
          </React.Fragment>
        )}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  describe('cycle', () => {
    it('renders current index at the beginning', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={0} scrollType="cycle" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders current index in the middle', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={2} scrollType="cycle" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders current index at the end', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={4} scrollType="cycle" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });
  });

  describe('overflow', () => {
    it('renders current index at the beginning', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={0} scrollType="overflow" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders current index in the middle', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={2} scrollType="overflow" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders current index at the end', () => {
      const { lastFrame } = render(
        <ScrollableList {...props} currentIndex={4} scrollType="overflow" />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can customize overflow labels', () => {
      const { lastFrame } = render(
        <ScrollableList
          {...props}
          scrollType="overflow"
          overflowAfterLabel="Below"
          overflowBeforeLabel="Above"
        />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can customize labels with a function', () => {
      const { lastFrame } = render(
        <ScrollableList
          {...props}
          scrollType="overflow"
          overflowAfterLabel={(count) => `${count} below`}
          overflowBeforeLabel={(count) => `${count} above`}
        />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('filters out leading disabled and dividers', () => {
      const { lastFrame } = render(
        <ScrollableList
          {...props}
          currentIndex={4}
          items={[
            { divider: true, value: '---' },
            { disabled: true, value: 'a' },
            { value: 'b' },
            { value: 'c' },
            { value: 'd' },
            { value: 'e' },
          ]}
          scrollType="overflow"
        />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('filters out trailing disabled and dividers', () => {
      const { lastFrame } = render(
        <ScrollableList
          {...props}
          currentIndex={0}
          items={[
            { value: 'a' },
            { value: 'b' },
            { value: 'c' },
            { divider: true, value: '---' },
            { disabled: true, value: 'd' },
            { value: 'e' },
          ]}
          scrollType="overflow"
        />,
      );

      expect(lastFrame()).toMatchSnapshot();
    });
  });
});

describe('calculateIndexes()', () => {
  describe('cycle', () => {
    it('returns the beginning if current index is low (even)', () => {
      expect(calculateIndexes(maxIndex, 1, 4, 'cycle')).toEqual({ endIndex: 4, startIndex: 1 });
    });

    it('returns the beginning if current index is low (odd)', () => {
      expect(calculateIndexes(maxIndex, 2, 5, 'cycle')).toEqual({ endIndex: 6, startIndex: 2 });
    });

    it('returns the end if current index is high (even)', () => {
      expect(calculateIndexes(maxIndex, 8, 4, 'cycle')).toEqual({ endIndex: -1, startIndex: 8 });
    });

    it('returns the end if current index is high (odd)', () => {
      expect(calculateIndexes(maxIndex, 8, 5, 'cycle')).toEqual({ endIndex: -2, startIndex: 8 });
    });

    it('returns correct indexes for even limits', () => {
      expect(calculateIndexes(maxIndex, -1, 4, 'cycle')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 0, 4, 'cycle')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 1, 4, 'cycle')).toEqual({ endIndex: 4, startIndex: 1 });
      expect(calculateIndexes(maxIndex, 2, 4, 'cycle')).toEqual({ endIndex: 5, startIndex: 2 });
      expect(calculateIndexes(maxIndex, 3, 4, 'cycle')).toEqual({ endIndex: 6, startIndex: 3 });
      expect(calculateIndexes(maxIndex, 4, 4, 'cycle')).toEqual({ endIndex: 7, startIndex: 4 });
      expect(calculateIndexes(maxIndex, 5, 4, 'cycle')).toEqual({ endIndex: 8, startIndex: 5 });
      expect(calculateIndexes(maxIndex, 6, 4, 'cycle')).toEqual({ endIndex: 9, startIndex: 6 });
      expect(calculateIndexes(maxIndex, 7, 4, 'cycle')).toEqual({ endIndex: -0, startIndex: 7 });
      expect(calculateIndexes(maxIndex, 8, 4, 'cycle')).toEqual({ endIndex: -1, startIndex: 8 });
      expect(calculateIndexes(maxIndex, 9, 4, 'cycle')).toEqual({ endIndex: -2, startIndex: 9 });
      expect(calculateIndexes(maxIndex, 10, 4, 'cycle')).toEqual({ endIndex: -2, startIndex: 9 });
    });

    it('returns correct indexes for odd limits', () => {
      expect(calculateIndexes(maxIndex, -1, 5, 'cycle')).toEqual({ endIndex: 4, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 0, 5, 'cycle')).toEqual({ endIndex: 4, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 1, 5, 'cycle')).toEqual({ endIndex: 5, startIndex: 1 });
      expect(calculateIndexes(maxIndex, 2, 5, 'cycle')).toEqual({ endIndex: 6, startIndex: 2 });
      expect(calculateIndexes(maxIndex, 3, 5, 'cycle')).toEqual({ endIndex: 7, startIndex: 3 });
      expect(calculateIndexes(maxIndex, 4, 5, 'cycle')).toEqual({ endIndex: 8, startIndex: 4 });
      expect(calculateIndexes(maxIndex, 5, 5, 'cycle')).toEqual({ endIndex: 9, startIndex: 5 });
      expect(calculateIndexes(maxIndex, 6, 5, 'cycle')).toEqual({ endIndex: -0, startIndex: 6 });
      expect(calculateIndexes(maxIndex, 7, 5, 'cycle')).toEqual({ endIndex: -1, startIndex: 7 });
      expect(calculateIndexes(maxIndex, 8, 5, 'cycle')).toEqual({ endIndex: -2, startIndex: 8 });
      expect(calculateIndexes(maxIndex, 9, 5, 'cycle')).toEqual({ endIndex: -3, startIndex: 9 });
      expect(calculateIndexes(maxIndex, 10, 5, 'cycle')).toEqual({ endIndex: -3, startIndex: 9 });
    });
  });

  describe('overflow', () => {
    it('returns the beginning if current index is low (even)', () => {
      expect(calculateIndexes(maxIndex, 1, 4, 'overflow')).toEqual({ endIndex: 3, startIndex: 0 });
    });

    it('returns the beginning if current index is low (odd)', () => {
      expect(calculateIndexes(maxIndex, 2, 5, 'overflow')).toEqual({ endIndex: 4, startIndex: 0 });
    });

    it('returns the end if current index is high (even)', () => {
      expect(calculateIndexes(maxIndex, 8, 4, 'overflow')).toEqual({ endIndex: 9, startIndex: 6 });
    });

    it('returns the end if current index is high (odd)', () => {
      expect(calculateIndexes(maxIndex, 8, 5, 'overflow')).toEqual({ endIndex: 9, startIndex: 5 });
    });

    it('returns correct indexes for even limits', () => {
      expect(calculateIndexes(maxIndex, -1, 4, 'overflow')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 0, 4, 'overflow')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 1, 4, 'overflow')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 2, 4, 'overflow')).toEqual({ endIndex: 3, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 3, 4, 'overflow')).toEqual({ endIndex: 4, startIndex: 1 });
      expect(calculateIndexes(maxIndex, 4, 4, 'overflow')).toEqual({ endIndex: 5, startIndex: 2 });
      expect(calculateIndexes(maxIndex, 5, 4, 'overflow')).toEqual({ endIndex: 6, startIndex: 3 });
      expect(calculateIndexes(maxIndex, 6, 4, 'overflow')).toEqual({ endIndex: 7, startIndex: 4 });
      expect(calculateIndexes(maxIndex, 7, 4, 'overflow')).toEqual({ endIndex: 8, startIndex: 5 });
      expect(calculateIndexes(maxIndex, 8, 4, 'overflow')).toEqual({ endIndex: 9, startIndex: 6 });
      expect(calculateIndexes(maxIndex, 9, 4, 'overflow')).toEqual({ endIndex: 9, startIndex: 6 });
      expect(calculateIndexes(maxIndex, 10, 4, 'overflow')).toEqual({ endIndex: 9, startIndex: 6 });
    });

    it('returns correct indexes for odd limits', () => {
      expect(calculateIndexes(maxIndex, -1, 3, 'overflow')).toEqual({ endIndex: 2, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 0, 3, 'overflow')).toEqual({ endIndex: 2, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 1, 3, 'overflow')).toEqual({ endIndex: 2, startIndex: 0 });
      expect(calculateIndexes(maxIndex, 2, 3, 'overflow')).toEqual({ endIndex: 3, startIndex: 1 });
      expect(calculateIndexes(maxIndex, 3, 3, 'overflow')).toEqual({ endIndex: 4, startIndex: 2 });
      expect(calculateIndexes(maxIndex, 4, 3, 'overflow')).toEqual({ endIndex: 5, startIndex: 3 });
      expect(calculateIndexes(maxIndex, 5, 3, 'overflow')).toEqual({ endIndex: 6, startIndex: 4 });
      expect(calculateIndexes(maxIndex, 6, 3, 'overflow')).toEqual({ endIndex: 7, startIndex: 5 });
      expect(calculateIndexes(maxIndex, 7, 3, 'overflow')).toEqual({ endIndex: 8, startIndex: 6 });
      expect(calculateIndexes(maxIndex, 8, 3, 'overflow')).toEqual({ endIndex: 9, startIndex: 7 });
      expect(calculateIndexes(maxIndex, 9, 3, 'overflow')).toEqual({ endIndex: 9, startIndex: 7 });
      expect(calculateIndexes(maxIndex, 10, 3, 'overflow')).toEqual({ endIndex: 9, startIndex: 7 });
    });
  });
});

describe('truncateList()', () => {
  it('returns the correct slices for start and end indexes', () => {
    expect(truncateList(items, 0, 3)).toEqual({
      leading: [],
      list: [0, 1, 2, 3],
      trailing: [4, 5, 6, 7, 8, 9],
    });

    expect(truncateList(items, 3, 6)).toEqual({
      leading: [0, 1, 2],
      list: [3, 4, 5, 6],
      trailing: [7, 8, 9],
    });

    expect(truncateList(items, 5, 7)).toEqual({
      leading: [0, 1, 2, 3, 4],
      list: [5, 6, 7],
      trailing: [8, 9],
    });

    expect(truncateList(items, 6, 9)).toEqual({
      leading: [0, 1, 2, 3, 4, 5],
      list: [6, 7, 8, 9],
      trailing: [],
    });
  });

  it('can put a higher end index than necessary', () => {
    expect(truncateList(items, 6, 15)).toEqual({
      leading: [0, 1, 2, 3, 4, 5],
      list: [6, 7, 8, 9],
      trailing: [],
    });
  });

  it('can wrap past the end using a negative index', () => {
    expect(truncateList(items, 8, -3)).toEqual({
      leading: [],
      list: [8, 9, 0, 1, 2, 3],
      trailing: [4, 5, 6, 7],
    });
  });

  it('can wrap past the beginning using a negative index', () => {
    expect(truncateList(items, -7, 2)).toEqual({
      leading: [],
      list: [7, 8, 9, 0, 1, 2],
      trailing: [3, 4, 5, 6],
    });
  });
});
