import React from 'react';
import { Text, TextProps } from 'ink';
import loadTheme from '../helpers/loadTheme';
import { StyleType, Writeable } from '../types';

export interface StyleProps extends Pick<TextProps, 'bold' | 'italic' | 'underline' | 'wrap'> {
  children: NonNullable<React.ReactNode>;
  inverted?: boolean;
  type?: StyleType | 'none';
}

export function Style({ children, inverted = false, type = 'none', ...restProps }: StyleProps) {
  const theme = loadTheme();
  const props: Writeable<TextProps> = {};

  if (type !== 'none') {
    if (inverted) {
      props.backgroundColor = theme[type];
      props.color = theme.inverted;
    } else {
      props.color = theme[type];
    }
  }

  return (
    <Text {...restProps} {...props}>
      {children}
    </Text>
  );
}
