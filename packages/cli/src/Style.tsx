import React from 'react';
import { Color, ColorProps } from 'ink';
import { StyleType, Writeable } from './types';
import loadTheme from './helpers/loadTheme';

export interface StyleProps
  extends Pick<ColorProps, 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'hidden'> {
  children: NonNullable<React.ReactNode>;
  inverted?: boolean;
  type: StyleType;
}

export default function Style({ children, inverted = false, type, ...restProps }: StyleProps) {
  const theme = loadTheme();
  const shade = theme[type];
  const props: Writeable<ColorProps> = {};

  const injectColor = (color: string, bg: boolean) => {
    // istanbul ignore next
    if (color.startsWith('#')) {
      props[bg ? 'bgHex' : 'hex'] = color;
    } else {
      props[(bg ? `bg${color.charAt(0).toUpperCase() + color.slice(1)}` : color) as 'black'] = true;
    }
  };

  if (type === 'default') {
    if (inverted) {
      injectColor(theme.default, true);
      injectColor(theme.inverted, false);
    } else {
      injectColor(theme.default, false);
      injectColor(theme.inverted, true);
    }
  } else {
    injectColor(shade, inverted);

    if (inverted) {
      injectColor('black', false);
    }
  }

  return (
    <Color {...restProps} {...props}>
      {children}
    </Color>
  );
}
