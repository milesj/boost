import React from 'react';
import { Select, SelectProps } from './Select';

export type InferMultiSelectType<T> = T extends unknown[] ? T : T[];
export type MultiSelectProps<T> = Omit<SelectProps<InferMultiSelectType<T>>, 'multiple'>;

export function MultiSelect<T>(props: MultiSelectProps<T>) {
  return <Select<InferMultiSelectType<T>> {...props} multiple />;
}
