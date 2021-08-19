import React from 'react';
import { Input, InputProps } from './Input';

export type HiddenInputProps = Omit<InputProps, 'hideCursor' | 'mask'>;

/**
 * A React component that renders an input field that hides its content from the terminal.
 */
export function HiddenInput(props: HiddenInputProps) {
	return <Input {...props} hideCursor mask="" />;
}
