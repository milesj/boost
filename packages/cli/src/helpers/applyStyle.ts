import { style } from '@boost/terminal';
import loadTheme from './loadTheme';
import { StyleType } from '../types';

export default function applyStyle(text: string, type: StyleType): string {
  const color = loadTheme()[type];
  const apply = color.charAt(0) === '#' ? style.hex(color) : style[color as 'black'];

  return apply(text);
}
