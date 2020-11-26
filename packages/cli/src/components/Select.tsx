/* eslint-disable no-nested-ternary */

import React, { useCallback, useMemo, useState } from 'react';
import { useFocus } from 'ink';
import { isObject } from '@boost/common';
import { Prompt, PromptProps } from './internal/Prompt';
import { ScrollableList, ScrollableListProps } from './internal/ScrollableList';
import { Selected } from './internal/Selected';
import { DividerRow } from './internal/DividerRow';
import { OptionRow } from './internal/OptionRow';
import { useListNavigation } from '../hooks';

export type SelectOption<T> = { label: string; value: T } | { divider: true; label?: string };

export interface SelectProps<T, V = T> extends PromptProps<T>, ScrollableListProps {
  defaultSelected?: T;
  options: (V | SelectOption<V>)[];
}

export function normalizeOptions<T>(
  options: SelectProps<unknown>['options'],
): {
  divider: boolean;
  index: number;
  label: string;
  value: T | null;
}[] {
  return options.map((option, index) => {
    if (isObject(option)) {
      return {
        divider: false,
        index,
        label: '',
        value: null,
        ...(option as any),
      };
    }

    return {
      divider: false,
      index,
      label: String(option),
      value: option,
    };
  });
}

export function Select<T = string>({
  defaultSelected,
  limit,
  onSubmit,
  options: baseOptions,
  scrollType,
  ...props
}: SelectProps<T>) {
  const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
  const [selectedValue, setSelectedValue] = useState<T | null>(defaultSelected ?? null);
  const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
  const { isFocused } = useFocus({ autoFocus: true });

  const handleReturn = useCallback(() => {
    const { value } = options[highlightedIndex];

    if (value !== null) {
      setSelectedValue(value);
      onSubmit?.(value);
    }

    // Trigger submit
    return true;
  }, [highlightedIndex, options, onSubmit]);

  return (
    <Prompt<T>
      {...props}
      {...arrowKeyProps}
      afterLabel={selectedValue !== null && <Selected value={selectedValue} />}
      focused={isFocused}
      value={selectedValue}
      onReturn={handleReturn}
    >
      <ScrollableList currentIndex={highlightedIndex} limit={limit} scrollType={scrollType}>
        {options.map((option) => {
          if (option.divider) {
            return <DividerRow label={option.label} />;
          }

          return (
            <OptionRow
              key={option.index}
              highlighted={highlightedIndex === option.index}
              label={option.label}
              selected={selectedValue === option.value}
            />
          );
        })}
      </ScrollableList>
    </Prompt>
  );
}
