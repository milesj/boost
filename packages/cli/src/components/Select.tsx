/* eslint-disable no-nested-ternary */

import React, { useCallback, useMemo, useState } from 'react';
import { Box, useFocus } from 'ink';
import { isObject, toArray } from '@boost/common';
import { figures } from '@boost/terminal';
import { Prompt, PromptProps } from './internal/Prompt';
import { ScrollableList, ScrollableListProps } from './internal/ScrollableList';
import { Style } from './Style';
import { Selected } from './internal/Selected';

export type InferSelectValue<T> = T extends (infer V)[] ? V : T;
export type SelectOption<T> = { label: string; value: T } | { divider: true; label?: string };

export interface SelectProps<T, V = InferSelectValue<T>>
  extends PromptProps<T>,
    ScrollableListProps {
  defaultSelected?: T;
  /** @ignore */
  multiple?: boolean;
  options: (V | SelectOption<V>)[];
}

function normalizeOptions<T>(
  options: SelectProps<T>['options'],
): {
  divider: boolean;
  index: number;
  label: string;
  value: T;
}[] {
  return options
    .map((option) => {
      if (isObject(option)) {
        return {
          divider: false,
          index: 0,
          label: '',
          value: (null as unknown) as T,
          ...option,
        };
      }

      return {
        divider: false,
        index: 0,
        label: String(option),
        value: option,
      };
    })
    .map((option, index) => {
      // eslint-disable-next-line no-param-reassign
      option.index = index;

      return option;
    });
}

export function Select<T = string>({
  defaultSelected,
  limit,
  multiple,
  onSubmit,
  options: baseOptions,
  scrollType,
  ...props
}: SelectProps<T>) {
  const options = useMemo(() => normalizeOptions(baseOptions), [baseOptions]);
  const optionsLength = useMemo(() => options.length, [options]);
  const getNextIndex = useCallback(
    (index: number, step: number) => {
      let nextIndex = index;

      if (nextIndex >= optionsLength) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = optionsLength - 1;
      }

      if (options[nextIndex]?.divider) {
        nextIndex = getNextIndex(nextIndex + step, step);
      }

      return nextIndex;
    },
    [options, optionsLength],
  );

  const [selectedValues, setSelectedValues] = useState(new Set(toArray(defaultSelected)));
  const [highlightedIndex, setHighlightedIndex] = useState(() => getNextIndex(0, 1));
  const { isFocused } = useFocus({ autoFocus: true });

  // Selection
  const handleInput = (input: string) => {
    if (multiple && input === ' ') {
      const { value } = options[highlightedIndex];

      if (selectedValues.has(value)) {
        selectedValues.delete(value);
      } else {
        selectedValues.add(value);
      }

      setSelectedValues(new Set(selectedValues));
    }
  };

  const handleReturn = () => {
    if (multiple) {
      onSubmit?.((Array.from(selectedValues) as unknown) as T);
    } else {
      const { value } = options[highlightedIndex];

      setSelectedValues(new Set(selectedValues.add(value)));
      onSubmit?.(value);
    }

    return true;
  };

  // Navigation
  const handleKeyDown = useCallback(() => {
    setHighlightedIndex((index) => getNextIndex(index + 1, 1));
  }, [getNextIndex]);

  const handleKeyUp = useCallback(() => {
    setHighlightedIndex((index) => getNextIndex(index - 1, -1));
  }, [getNextIndex]);

  const handleKeyLeft = useCallback(() => {
    setHighlightedIndex(getNextIndex(0, 1));
  }, [getNextIndex]);

  const handleKeyRight = useCallback(() => {
    setHighlightedIndex(getNextIndex(optionsLength - 1, -1));
  }, [getNextIndex, optionsLength]);

  const selectedList = Array.from(selectedValues);
  const value = multiple ? selectedList : selectedList[0];

  return (
    <Prompt<T>
      {...props}
      afterLabel={selectedList.length > 0 && <Selected value={selectedList} />}
      focused={isFocused}
      value={(value as unknown) as T}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onKeyLeft={handleKeyLeft}
      onKeyRight={handleKeyRight}
      onReturn={handleReturn}
    >
      <ScrollableList currentIndex={highlightedIndex} limit={limit} scrollType={scrollType}>
        {options.map((option) => {
          if (option.divider) {
            return (
              <Box key={option.index} marginLeft={2}>
                <Style type="muted">{option.label || '────'}</Style>
              </Box>
            );
          }

          const selected = selectedValues.has(option.value);
          const highlighted = highlightedIndex === option.index;

          return (
            <Box key={option.index} flexDirection="row">
              <Box flexGrow={0} marginRight={1}>
                <Style type={highlighted ? 'info' : selected ? 'notice' : 'muted'}>
                  {highlighted || selected ? figures.pointer : figures.pointerSmall}
                </Style>
              </Box>

              <Box>
                <Style type={highlighted ? 'info' : selected ? 'notice' : 'none'}>
                  {option.label}
                </Style>
              </Box>
            </Box>
          );
        })}
      </ScrollableList>
    </Prompt>
  );
}
