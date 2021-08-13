import React, { useCallback, useState } from 'react';
import { useFocus } from 'ink';
import { Cursor } from './internal/Cursor';
import { Prompt, PromptProps } from './internal/Prompt';
import { Style } from './Style';

export interface InputProps extends PromptProps<string> {
	/** A default value. If none provided, will use an empty state. */
	defaultValue?: string;
	/** Hide the cursor in the terminal. Will remove the background color, but still functions. */
	hideCursor?: boolean;
	/** Mask to replace every inputted character with. */
	mask?: string;
	/** Callback triggered when the value changes. */
	onChange?: (value: string) => void;
	/** Custom string to display when the value is empty and non-dirty. */
	placeholder?: string;
}

/**
 * A React component that renders an input field, allowing the user to enter information.
 */
export function Input(props: InputProps) {
	const {
		defaultValue = '',
		hideCursor,
		mask,
		onChange,
		onSubmit,
		placeholder,
		...restProps
	} = props;
	const [value, setValue] = useState(defaultValue);
	const [cursorPosition, setCursorPosition] = useState(0);
	const [isDirty, setDirty] = useState(false);
	const { isFocused } = useFocus({ autoFocus: true });

	const handleReturn = useCallback(() => {
		onSubmit(value.trim());

		// Trigger submit
		return true;
	}, [onSubmit, value]);

	// Remove characters
	const handleBackspace = useCallback(() => {
		if (!cursorPosition || !value) {
			return;
		}

		const nextValue =
			cursorPosition >= value.length
				? value.slice(0, -1)
				: value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);

		setCursorPosition(cursorPosition - 1);
		setValue(nextValue);
		onChange?.(nextValue);
	}, [cursorPosition, onChange, value]);

	// Add characters
	const handleInput = useCallback(
		(input: string) => {
			const nextValue =
				cursorPosition >= value.length
					? value + input
					: value.slice(0, cursorPosition) + input + value.slice(cursorPosition);

			setCursorPosition(cursorPosition + input.length);
			setValue(nextValue);
			setDirty(true);
			onChange?.(nextValue);
		},
		[cursorPosition, onChange, value],
	);

	// Navigation
	const handleKeyUp = useCallback(() => {
		setCursorPosition(0);
	}, []);

	const handleKeyDown = useCallback(() => {
		setCursorPosition(value.length);
	}, [value]);

	const handleKeyLeft = useCallback(() => {
		setCursorPosition((prev) => Math.max(prev - 1, 0));
	}, []);

	const handleKeyRight = useCallback(() => {
		setCursorPosition((prev) => Math.min(prev + 1, value.length));
	}, [value]);

	return (
		<Prompt<string>
			{...restProps}
			afterLabel={
				value === '' && !isDirty && placeholder ? (
					<Style type="muted">{placeholder}</Style>
				) : (
					<Cursor
						focused={isFocused}
						hideCursor={hideCursor}
						position={cursorPosition}
						value={mask === undefined ? value : mask.repeat(value.length)}
					/>
				)
			}
			focused={isFocused}
			value={value}
			onBackspace={handleBackspace}
			onDelete={handleBackspace}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
			onKeyLeft={handleKeyLeft}
			onKeyRight={handleKeyRight}
			onKeyUp={handleKeyUp}
			onReturn={handleReturn}
		/>
	);
}
