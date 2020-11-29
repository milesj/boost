import React from 'react';
import { Input, InputProps } from './Input';

export type HiddenInputProps = Omit<InputProps, 'hideCursor' | 'mask'>;

export function HiddenInput(props: HiddenInputProps) {
  return <Input {...props} hideCursor mask="" />;
}
