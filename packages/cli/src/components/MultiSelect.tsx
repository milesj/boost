import React, { useCallback, useMemo, useState } from 'react';
import { useFocus } from 'ink';
import { toArray } from '@boost/common';
import { figures } from '@boost/terminal';
import { useListNavigation } from '../hooks';
import { DividerRow } from './internal/DividerRow';
import { OptionRow } from './internal/OptionRow';
import { Prompt } from './internal/Prompt';
import { ScrollableList } from './internal/ScrollableList';
import { Selected } from './internal/Selected';
import { normalizeOptions, SelectOption, SelectProps } from './Select';

export interface MultiSelectProps<T> extends SelectProps<T[], T> {
	/** List of option values selected by default. */
	defaultSelected?: T[];
	/** Callback triggered when a value is selected or unselected. */
	onChange?: (values: T[]) => void;
}

/**
 * A React component that renders a select menu with options, where multiple options can be seleted.
 * Options can be navigated with arrow keys, selected with "space", and submitted with "enter".
 */
export function MultiSelect<T>(props: MultiSelectProps<T>) {
	const {
		defaultSelected,
		limit,
		onChange,
		onSubmit,
		overflowAfterLabel,
		overflowBeforeLabel,
		options: baseOptions,
		scrollType,
		...restProps
	} = props;
	const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
	const [selectedValues, setSelectedValues] = useState(new Set(toArray(defaultSelected)));
	const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
	const { isFocused } = useFocus({ autoFocus: true });

	const handleSpace = useCallback(() => {
		const { value } = options[highlightedIndex];

		// istanbul ignore next
		if (value === null) {
			return;
		}
		if (selectedValues.has(value)) {
			selectedValues.delete(value);
		} else {
			selectedValues.add(value);
		}

		setSelectedValues(new Set(selectedValues));
		onChange?.([...selectedValues]);
	}, [highlightedIndex, onChange, options, selectedValues]);

	const handleReturn = useCallback(() => {
		onSubmit?.([...selectedValues]);

		// Trigger submit
		return true;
	}, [onSubmit, selectedValues]);

	const renderItem = useCallback(
		(option: SelectOption<T>) => {
			if (option.divider) {
				return <DividerRow key={option.index} label={option.label} />;
			}

			return (
				<OptionRow
					key={option.index}
					highlighted={highlightedIndex === option.index}
					icon={figures.circleDotted}
					iconActive={figures.bullet}
					label={option.label}
					selected={selectedValues.has(option.value!)}
				/>
			);
		},
		[highlightedIndex, selectedValues],
	);

	const selectedList = useMemo(() => [...selectedValues], [selectedValues]);

	return (
		<Prompt<T[]>
			{...restProps}
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
				renderItem={renderItem}
				scrollType={scrollType}
			/>
		</Prompt>
	);
}
