import React from 'react';
import { Select, SelectProps } from './Select';

export type MultiSelectProps<T> = Omit<SelectProps<T>, 'multiple'>;

export function MultiSelect<T>(props: MultiSelectProps<T>) {
  return <Select {...props} multiple />;
}
