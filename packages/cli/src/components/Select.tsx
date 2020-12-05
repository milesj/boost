import React, { useCallback, useMemo, useState } from 'react';
import { useFocus } from 'ink';
import { isObject } from '@boost/common';
import { figures } from '@boost/terminal';
import { Prompt, PromptProps } from './internal/Prompt';
import { ScrollableList, ScrollableListProps } from './internal/ScrollableList';
import { Selected } from './internal/Selected';
import { DividerRow } from './internal/DividerRow';
import { OptionRow } from './internal/OptionRow';
import { useListNavigation } from '../hooks';

export type SelectOptionLike<T> =
  | { label: string; value: T }
  | { divider: boolean; label?: string };

export interface SelectOption<T> {
  divider: boolean;
  index: number;
  label: string;
  value: T | null;
}

export interface SelectProps<T, V = T> extends PromptProps<T>, ScrollableListProps {
  options: (V | SelectOptionLike<V>)[];
}

export function normalizeOptions<T>(options: SelectProps<unknown>['options']): SelectOption<T>[] {
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
  limit,
  onSubmit,
  options: baseOptions,
  overflowAfterLabel,
  overflowBeforeLabel,
  scrollType,
  ...props
}: SelectProps<T>) {
  const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
  const [selectedValue, setSelectedValue] = useState<T | null>(null);
  const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
  const { isFocused } = useFocus({ autoFocus: true });

  const handleReturn = useCallback(() => {
    const { value } = options[highlightedIndex];

    if (value !== null) {
      setSelectedValue(value);
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
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
      <ScrollableList
        currentIndex={highlightedIndex}
        items={options}
        limit={limit}
        overflowAfterLabel={overflowAfterLabel}
        overflowBeforeLabel={overflowBeforeLabel}
        scrollType={scrollType}
        renderItem={(option) => {
          if (option.divider) {
            return <DividerRow key={option.index} label={option.label} />;
          }

          return (
            <OptionRow
              key={option.index}
              highlighted={highlightedIndex === option.index}
              icon={figures.pointerSmall}
              iconActive={figures.pointer}
              label={option.label}
              selected={selectedValue === option.value}
            />
          );
        }}
      />
    </Prompt>
  );
}
