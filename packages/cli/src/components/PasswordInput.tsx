import React from 'react';
import { Input, InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'mask'>;

export function PasswordInput(props: PasswordInputProps) {
	return <Input {...props} mask="*" />;
}
