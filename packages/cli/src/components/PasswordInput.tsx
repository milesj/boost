import React from 'react';
import { Input, InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'mask'>;

/**
 * A React component that renders an input field with characters masked with "*".
 */
export function PasswordInput(props: PasswordInputProps) {
	return <Input {...props} mask="*" />;
}
