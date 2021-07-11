import { style } from '@boost/terminal';
import { StyleType } from '../types';
import loadTheme from './loadTheme';

export default function applyStyle(text: string, type: StyleType): string {
	const color = loadTheme()[type];
	const apply = color.charAt(0) === '#' ? style.hex(color) : style[color as 'black'];

	return apply(text);
}
