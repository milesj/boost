import React from 'react';
import { applyStyle } from '../../helpers';
import { Style } from '../Style';

export interface SelectedProps<T> {
	value: T | T[];
}

export function Selected<T>({ value }: SelectedProps<T>) {
	const selected = Array.isArray(value)
		? [...value].sort().join(applyStyle(', ', 'muted'))
		: String(value);

	return <Style type="notice">{selected}</Style>;
}
