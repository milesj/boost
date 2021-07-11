import { style } from '@boost/terminal';
import { StyleType } from '../types';
import { loadTheme } from './loadTheme';

export function applyStyle(text: string, type: StyleType): string {
	const color = loadTheme()[type];
	const apply = color.startsWith('#') ? style.hex(color) : style[color as 'black'];

	return apply(text);
}
