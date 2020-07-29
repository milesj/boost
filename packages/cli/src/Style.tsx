import React from 'react';
import { Text, TextProps } from 'ink';
import { StyleType, Writeable } from './types';
import loadTheme from './helpers/loadTheme';

export interface StyleProps extends Pick<TextProps, 'bold' | 'italic' | 'underline' | 'wrap'> {
  children: NonNullable<React.ReactNode>;
  inverted?: boolean;
  type: StyleType | 'none';
}

export default function Style({ children, inverted = false, type, ...restProps }: StyleProps) {
  const theme = loadTheme();
  const props: Writeable<TextProps> = {};

  const injectColor = (color: string, bg: boolean) => {
    props[bg ? 'backgroundColor' : 'color'] = color;
  };

  if (type === 'default') {
    if (inverted) {
      injectColor(theme.default, true);
      injectColor(theme.inverted, false);
    } else {
      injectColor(theme.default, false);
      injectColor(theme.inverted, true);
    }
  } else if (type !== 'none') {
    injectColor(theme[type], inverted);
    injectColor(theme.inverted, !inverted);
  }

  return (
    <Text {...restProps} {...props}>
      {children}
    </Text>
  );
}
