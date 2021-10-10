import React, { useCallback, useMemo, useState } from 'react';
import { useFocus } from 'ink';
import { isObject } from '@boost/common';
import { figures } from '@boost/terminal';
import { useListNavigation } from '../hooks';
import { DividerRow } from './internal/DividerRow';
import { OptionRow } from './internal/OptionRow';
import { Prompt, PromptProps } from './internal/Prompt';
import { ScrollableList, ScrollableListProps } from './internal/ScrollableList';
import { Selected } from './internal/Selected';

export type SelectOptionLike<T> =
	| { divider: boolean; label?: NonNullable<React.ReactNode> }
	| { label: NonNullable<React.ReactNode>; value: T };

export interface SelectOption<T> {
	divider: boolean;
	index: number;
	label: NonNullable<React.ReactNode>;
	value: T | null;
}

export interface SelectProps<T, V = T> extends PromptProps<T>, ScrollableListProps {
	/** Option value selected by default. */
	defaultSelected?: T;
	/** List of options to choose from. Can either be a string, number, or object with a `label` and `value`. */
	options: (SelectOptionLike<V> | V)[];
}

export function normalizeOptions<T>(options: SelectProps<unknown>['options']): SelectOption<T>[] {
	return options.map((option, index) => {
		if (isObject(option)) {
			return {
				divider: false,
				index,
				label: '',
				value: null,
				...(option as {}),
			};
		}

		return {
			divider: false,
			index,
			label: String(option),
			value: option,
		};
	}) as SelectOption<T>[];
}

/**
 * A React component that renders a select menu with options, where a single option can be seleted.
 * Options can be navigated with arrow keys, selected with "space", and submitted with "enter".
 */
export function Select<T = string>(props: SelectProps<T>) {
	const {
		defaultSelected,
		limit,
		onSubmit,
		options: baseOptions,
		overflowAfterLabel,
		overflowBeforeLabel,
		scrollType,
		...restProps
	} = props;
	const options = useMemo(() => normalizeOptions<T>(baseOptions), [baseOptions]);
	const [selectedValue, setSelectedValue] = useState<T | null>(defaultSelected ?? null);
	const { highlightedIndex, ...arrowKeyProps } = useListNavigation(options);
	const { isFocused } = useFocus({ autoFocus: true });

	const handleSpace = useCallback(() => {
		const { value } = options[highlightedIndex];

		if (value !== null) {
			if (value === selectedValue) {
				setSelectedValue(null);
			} else {
				setSelectedValue(value);
			}
		}
	}, [highlightedIndex, options, selectedValue]);

	const handleReturn = useCallback(() => {
		let value = selectedValue;

		if (value === null) {
			({ value } = options[highlightedIndex]);
			setSelectedValue(value);
		}

		onSubmit?.(value!);

		// Trigger submit
		return true;
	}, [selectedValue, onSubmit, options, highlightedIndex]);

	const renderItem = useCallback(
		(option: SelectOption<T>) => {
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
		},
		[highlightedIndex, selectedValue],
	);

	return (
		<Prompt<T>
			{...restProps}
			{...arrowKeyProps}
			afterLabel={selectedValue !== null && <Selected value={selectedValue} />}
			focused={isFocused}
			value={selectedValue}
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
