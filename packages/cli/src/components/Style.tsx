import React from 'react';
import { Text, TextProps } from 'ink';
import { StyleType, Writeable } from '../types';
import loadTheme from '../helpers/loadTheme';

export interface StyleProps extends Pick<TextProps, 'bold' | 'italic' | 'underline' | 'wrap'> {
  children: NonNullable<React.ReactNode>;
  inverted?: boolean;
  type: StyleType | 'none';
}

export default function Style({ children, inverted = false, type, ...restProps }: StyleProps) {
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
