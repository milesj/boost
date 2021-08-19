import React, { useCallback, useState } from 'react';
import { Box, Key, useFocusManager, useInput } from 'ink';
import { figures } from '@boost/terminal';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Style } from '../Style';
import { Label } from './Label';

export type KeyInput = Key;

export interface PromptProps<T> {
	/** Label to display before or above the prompt itself. */
	label: NonNullable<React.ReactNode>;
	/** Single character symbol to display before the label. Defaults to "?"". */
	prefix?: string;
	/** Callback triggered when the value is submitted. */
	onSubmit: (value: T) => void;
	/** Function to validate the value on submit. To trigger a failed state, thrown an `Error`. */
	validate?: (value: T) => void;
}

export interface InternalPromptProps<T> extends Omit<PromptProps<T>, 'onSubmit'> {
	afterLabel?: React.ReactNode;
	beforeLabel?: React.ReactNode;
	children?: React.ReactNode;
	focused?: boolean;
	onBackspace?: (key: KeyInput) => void;
	onDelete?: (key: KeyInput) => void;
	onEscape?: (key: KeyInput) => void;
	onInput?: (value: string, key: KeyInput) => boolean | void;
	onKeyDown?: (key: KeyInput) => void;
	onKeyLeft?: (key: KeyInput) => void;
	onKeyRight?: (key: KeyInput) => void;
	onKeyUp?: (key: KeyInput) => void;
	onPageDown?: (key: KeyInput) => void;
	onPageUp?: (key: KeyInput) => void;
	onReturn?: () => boolean | void;
	onSpace?: (key: KeyInput) => void;
	onTab?: (key: KeyInput) => void;
	value: T | null;
}

export function Prompt<T>({
	afterLabel,
	beforeLabel,
	children,
	focused,
	label,
	onBackspace,
	onDelete,
	onEscape,
	onInput,
	onKeyDown,
	onKeyLeft,
	onKeyRight,
	onKeyUp,
	onPageDown,
	onPageUp,
	onReturn,
	onSpace,
	onTab,
	prefix = '?',
	validate,
	value,
}: InternalPromptProps<T>) {
	const { focusNext } = useFocusManager();
	const [error, setError] = useState<Error | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const mounted = useIsMounted();

	const attemptSubmit = useCallback(
		(commit: () => boolean | void) => {
			let doSubmit = false;

			try {
				setError(null);

				doSubmit = !!commit();
			} catch (error_: unknown) {
				doSubmit = false;

				if (error_ instanceof Error) {
					setError(error_);
				}
			}

			if (!mounted.current) {
				return;
			}

			setSubmitted(doSubmit);

			if (doSubmit) {
				focusNext();
			}
		},
		[focusNext, mounted],
	);

	useInput(
		// eslint-disable-next-line complexity
		(input, key) => {
			if (!mounted.current) {
				return;
			}

			if (key.upArrow) {
				onKeyUp?.(key);
			} else if (key.downArrow) {
				onKeyDown?.(key);
			} else if (key.leftArrow) {
				onKeyLeft?.(key);
			} else if (key.rightArrow) {
				onKeyRight?.(key);
			} else if (key.pageUp) {
				onPageUp?.(key);
			} else if (key.pageDown) {
				onPageDown?.(key);
			} else if (key.return) {
				// Only run if we want validation or to submit,
				// otherwise we trigger an unwanted submitted state
				if (onReturn || validate) {
					attemptSubmit(() => {
						if (value !== null) {
							validate?.(value);
						}

						return onReturn?.();
					});
				}
			} else if (key.tab) {
				onTab?.(key);
			} else if (key.backspace) {
				onBackspace?.(key);
				setSubmitted(false);
			} else if (key.delete) {
				onDelete?.(key);
				setSubmitted(false);
			} else if (key.escape) {
				onEscape?.(key);
			} else if (input === ' ' && onSpace) {
				onSpace(key);
				setSubmitted(false);
			} else {
				attemptSubmit(() => onInput?.(input, key));
			}
		},
		{ isActive: focused },
	);

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Box>
					{submitted && !error && <Style type="success">{figures.tick}</Style>}
					{!submitted && error && <Style type="failure">{figures.cross}</Style>}
					{!submitted && !error && <Style type="info">{prefix}</Style>}
				</Box>

				{beforeLabel}

				<Box marginLeft={1} marginRight={1}>
					<Label>{label}</Label>
				</Box>

				{afterLabel}
			</Box>

			{error && (
				<Box marginLeft={2}>
					<Style type="failure">{error.message}</Style>
				</Box>
			)}

			{children && focused && (
				<Box flexDirection="column" marginLeft={2}>
					{children}
				</Box>
			)}
		</Box>
	);
}
