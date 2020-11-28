import React, { useCallback, useMemo, useState } from 'react';
import { useFocus } from 'ink';
import { toArray } from '@boost/common';
import { useListNavigation } from '../hooks';
import { Prompt } from './internal/Prompt';
import { ScrollableList } from './internal/ScrollableList';
import { Selected } from './internal/Selected';
import { DividerRow } from './internal/DividerRow';
import { OptionRow } from './internal/OptionRow';
import { SelectProps, normalizeOptions } from './Select';

export interface MultiSelectProps<T> extends SelectProps<T[], T> {
  defaultSelected?: T[];
  onChange?: (values: T[]) => void;
}

export function MultiSelect<T>({
  defaultSelected,
  limit,
  onChange,
  onSubmit,
  overflowAfterLabel,
  overflowBeforeLabel,
  options: baseOptions,
  scrollType,
  ...props
}: MultiSelectProps<T>) {
  const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
  const [selectedValues, setSelectedValues] = useState(new Set(toArray(defaultSelected)));
  const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
  const { isFocused } = useFocus({ autoFocus: true });

  const handleSpace = useCallback(() => {
    const { value } = options[highlightedIndex];

    // istanbul ignore next
    if (value === null) {
      return;
    } else if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    setSelectedValues(new Set(selectedValues));
    onChange?.(Array.from(selectedValues));
  }, [highlightedIndex, onChange, options, selectedValues]);

  const handleReturn = useCallback(() => {
    onSubmit?.(Array.from(selectedValues));

    // Trigger submit
    return true;
  }, [onSubmit, selectedValues]);

  const selectedList = Array.from(selectedValues);

  return (
    <Prompt<T[]>
      {...props}
      {...arrowKeyProps}
      afterLabel={selectedList.length > 0 && <Selected value={selectedList} />}
      focused={isFocused}
      value={selectedList}
      onReturn={handleReturn}
      onSpace={handleSpace}
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
              label={option.label}
              selected={selectedValues.has(option.value!)}
            />
          );
        }}
      />
    </Prompt>
  );
}
