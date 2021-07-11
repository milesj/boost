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
	defaultSelected?: T;
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
	overflowAfterLabel,
	overflowBeforeLabel,
	scrollType,
	...props
}: SelectProps<T>) {
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

		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		onSubmit?.(value!);

		// Trigger submit
		return true;
	}, [selectedValue, onSubmit, options, highlightedIndex]);

	return (
		<Prompt<T>
			{...props}
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
				scrollType={scrollType}
			/>
		</Prompt>
	);
}
