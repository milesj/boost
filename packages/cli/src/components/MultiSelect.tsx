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

export type MultiSelectProps<T> = SelectProps<T[], T>;

export function MultiSelect<T>({
  defaultSelected,
  limit,
  onSubmit,
  options: baseOptions,
  scrollType,
  ...props
}: MultiSelectProps<T>) {
  const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
  const [selectedValues, setSelectedValues] = useState(new Set(toArray(defaultSelected)));
  const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
  const { isFocused } = useFocus({ autoFocus: true });

  const handleInput = useCallback(
    (input: string) => {
      if (input === ' ') {
        const { value } = options[highlightedIndex];

        if (value === null) {
          return;
        } else if (selectedValues.has(value)) {
          selectedValues.delete(value);
        } else {
          selectedValues.add(value);
        }

        setSelectedValues(new Set(selectedValues));
      }
    },
    [highlightedIndex, options, selectedValues],
  );

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
      onInput={handleInput}
      onReturn={handleReturn}
    >
      <ScrollableList currentIndex={highlightedIndex} limit={limit} scrollType={scrollType}>
        {options.map((option) => {
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
        })}
      </ScrollableList>
    </Prompt>
  );
}
